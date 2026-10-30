import { act, render } from '@testing-library/react'
import React from 'react'
import { JSDCContext } from '../../JSDC/Context'
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import { PathColorItem } from '../../JSDC/Dguidewalks/mapLayers'
import Event from '../../JSDC/utils/Event'
import { DuiContext, PathColorConfig } from '../Context'
import DguideWalksApp, { IDguideWalksAppProps } from '.'
import { applyFixedLanguage } from '../../i18n/config'

let mockLanguage = 'zh-TW'
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: mockLanguage, changeLanguage: () => undefined },
  }),
}))
// chroma-js 是 ESM，jest 不轉譯 node_modules；這裡只用到 DuiContext，不會真的呼叫它
jest.mock('../../i18n/config', () => ({
  applyFixedLanguage: jest.fn(),
  scopedStorageKey: (base: string) => base,
}))
jest.mock('chroma-js', () => ({ __esModule: true, default: () => ({}) }))
// 只看左側選單：地圖本體與景點的內建畫面不在這裡測
jest.mock('../MapViewContainer', () => ({
  __esModule: true,
  default: ({ menuChildren }: { menuChildren: React.ReactNode }) => (
    <div>{menuChildren}</div>
  ),
}))
jest.mock('../SceneCheckin', () => ({ __esModule: true, default: () => null }))

const routes: Record<string, PathColorItem[]> = {
  'zh-TW': [
    { name: '路線01', label: '路線01', color: '#C424F4' },
    { name: '路線02', label: '路線02', color: '#312531' },
  ],
  en: [
    { name: '路線01', label: 'Route 01', color: '#C424F4' },
    { name: '路線02', label: '路線02', color: '#312531' },
  ],
}

const setup = (
  pathColorConfig: PathColorConfig,
  {
    loaded = true,
    hasRoutes = true,
    layerInfos = [] as object[],
    layerNameOrder = [] as string[],
    legendConfig = { activeLegends: [] } as object,
    legendReady = true,
    images = {} as object,
    appProps = {} as IDguideWalksAppProps,
  } = {},
) => {
  let isLoaded = loaded
  const dataLoadEvent = new Event()
  const dgw = {
    layerNameOrder,
    apiProvider: { getVisitorCount: async () => ({ counter: 0 }) },
    articleProxyParser: { setLanguage: () => undefined },
    getSceneArticles: async () => [],
    dataLoadEvent,
    getPathColors: (language: string) =>
      isLoaded && hasRoutes ? routes[language] : [],
  }
  const dui = {
    sidebarTitle: '',
    sidebarSubtitle: '',
    activeMenuId: undefined,
    menuSwitcherAction: () => ({
      onClick: () => undefined,
      onClose: () => undefined,
    }),
    weatherConfig: { disabled: true },
    legendConfig,
    legendReady,
    settingConfig: {},
    ...images,
    pathColorConfig,
  }
  const { container } = render(
    <JSDCContext.Provider value={{ Jsdc: {}, layerInfos } as any}>
      <DguidewalksContext.Provider
        value={{ dgw, layerLegendImages: {}, layerNames: {} } as any}
      >
        <DuiContext.Provider value={dui as any}>
          <DguideWalksApp {...appProps} />
        </DuiContext.Provider>
      </DguidewalksContext.Provider>
    </JSDCContext.Provider>,
  )
  const titles = () =>
    Array.from(container.querySelectorAll('.list-item .text')).map(
      (element) => element.textContent,
    )
  const rows = () =>
    Array.from(container.querySelectorAll('.path-item')).map((row) => [
      row.querySelector('.path-name')?.textContent,
      (row.querySelector('.path-color') as HTMLElement).style.backgroundColor,
    ])
  const finishLoading = () =>
    act(() => {
      isLoaded = true
      dataLoadEvent.raise()
    })
  const layerNames = () =>
    Array.from(
      container.querySelectorAll('.dui-LayerItem-content > span:first-child'),
    ).map((element) => element.textContent)
  const legendIcons = () =>
    Array.from(container.querySelectorAll('.legend-item img')).map((img) =>
      (img as HTMLImageElement).src.replace(/^.*\/assets\//, ''),
    )
  return { container, titles, rows, finishLoading, layerNames, legendIcons }
}

describe('DguideWalksApp 的「路線顏色」選單', () => {
  beforeEach(() => {
    mockLanguage = 'zh-TW'
  })

  it('預設不顯示', () => {
    const { titles } = setup({})
    expect(titles()).not.toContain('menu.pathColor')
  })

  it('開啟後放在「工具設定」之後，列出線段名稱與顏色', () => {
    const { titles, rows } = setup({ enabled: true })
    expect(titles().indexOf('menu.pathColor')).toBe(
      titles().indexOf('menu.toolSettings') + 1,
    )
    expect(rows()).toEqual([
      ['路線01', 'rgb(196, 36, 244)'],
      ['路線02', 'rgb(49, 37, 49)'],
    ])
  })

  it('開啟了但沒有任何可列的線段時不渲染', () => {
    const { titles } = setup({ enabled: true }, { hasRoutes: false })
    expect(titles()).not.toContain('menu.pathColor')
  })

  it('圖層載入完成（dataLoadEvent）後才出現', () => {
    const { titles, finishLoading } = setup(
      { enabled: true },
      { loaded: false },
    )
    expect(titles()).not.toContain('menu.pathColor')
    finishLoading()
    expect(titles()).toContain('menu.pathColor')
  })

  it('語系是 en 時顯示線段的英文名稱', () => {
    mockLanguage = 'en'
    const { rows } = setup({ enabled: true })
    expect(rows().map(([label]) => label)).toEqual(['Route 01', '路線02'])
  })
})

describe('DguideWalksApp 的「圖例說明」選單', () => {
  it('預設顯示', () => {
    const { titles } = setup({})
    expect(titles()).toContain('menu.legendDescription')
  })

  it('legendConfig.disabled 時不渲染', () => {
    const { titles } = setup(
      {},
      { legendConfig: { disabled: true, activeLegends: [] } },
    )
    expect(titles()).not.toContain('menu.legendDescription')
    expect(titles()).toContain('menu.toolSettings')
  })
})

describe('DguideWalksApp 的圖層清單', () => {
  const info = (id: string, name: string) => ({
    id,
    show: false,
    description: { name, type: 'image' },
  })
  const layerInfos = [
    info('1', '堡圖'),
    info('2', '航照'),
    info('3', '堡圖'),
    info('4', '正射影像'),
  ]

  it('同名的圖層各自一列，不會少', () => {
    const { layerNames } = setup({}, { layerInfos })
    expect(layerNames()).toEqual(['堡圖', '航照', '堡圖', '正射影像'])
  })

  it('layerNameOrder 列到的排前面，其餘維持原順序', () => {
    const { layerNames } = setup(
      {},
      { layerInfos, layerNameOrder: ['正射影像', '堡圖'] },
    )
    expect(layerNames()).toEqual(['正射影像', '堡圖', '堡圖', '航照'])
  })
})

describe('DguideWalksApp 的圖例內容', () => {
  const colored = (icons: string[]) =>
    icons.filter((src) => !src.endsWith('-g.svg'))

  beforeEach(() => {
    mockLanguage = 'zh-TW'
  })

  it('固定畫 12 個類別，activeLegends 裡的用彩色版，其餘灰色版', () => {
    const { legendIcons } = setup(
      {},
      { legendConfig: { activeLegends: ['歷史建物', '商店'] } },
    )
    expect(legendIcons()).toHaveLength(12)
    expect(colored(legendIcons())).toEqual([
      'legends/icon-l-02.svg',
      'legends/icon-l-12.svg',
    ])
  })

  it('語系是 en 時換英文版圖示，亮起來的類別不變（用中文名稱比對）', () => {
    mockLanguage = 'en'
    const { legendIcons } = setup(
      {},
      { legendConfig: { activeLegends: ['歷史建物', '商店'] } },
    )
    expect(colored(legendIcons())).toEqual([
      'legends/en/icon-l-02.svg',
      'legends/en/icon-l-12.svg',
    ])
  })

  it('圖例沒有的類別名稱被忽略，不會壞', () => {
    const { legendIcons } = setup(
      {},
      { legendConfig: { activeLegends: ['不存在的類別', '聚落'] } },
    )
    expect(legendIcons()).toHaveLength(12)
    expect(colored(legendIcons())).toEqual(['legends/icon-l-03.svg'])
  })

  it('還不確定要亮哪些類別（legendReady = false）時先不畫圖示，選單項目仍在', () => {
    const { legendIcons, titles } = setup({}, { legendReady: false })
    expect(titles()).toContain('menu.legendDescription')
    expect(legendIcons()).toEqual([])
  })
})

describe('DguideWalksApp 的圖片（沒有圖時不渲染破圖）', () => {
  const headerVars = (container: HTMLElement) => {
    const style = (container.querySelector('.dui-MenuList') as HTMLElement)
      .style
    return [
      style.getPropertyValue('--header-img'),
      style.getPropertyValue('--header-mb-img'),
    ]
  }
  const aboutImg = (container: HTMLElement) =>
    container.querySelector('.dui-AboutWalkDialogContent-img img')

  it('有圖：主視覺是背景圖、路線介紹有 <img>', () => {
    const { container } = setup(
      {},
      {
        images: {
          headerDImgSrc: 'https://strapi.test/d.png',
          headerMBImgSrc: 'https://strapi.test/m.jpg',
          aboutWalkImgSrc: 'https://strapi.test/a.png',
        },
      },
    )
    expect(headerVars(container)).toEqual([
      'url("https://strapi.test/d.png")',
      'url("https://strapi.test/m.jpg")',
    ])
    expect(aboutImg(container)?.getAttribute('src')).toBe(
      'https://strapi.test/a.png',
    )
  })

  it('沒有圖（空字串）：背景是 none、不渲染 <img>，不會出現 url(undefined)', () => {
    const { container } = setup(
      {},
      {
        images: { headerDImgSrc: '', headerMBImgSrc: '', aboutWalkImgSrc: '' },
      },
    )
    expect(headerVars(container)).toEqual(['none', 'none'])
    expect(aboutImg(container)).toBeNull()
    expect(
      container.querySelector('.dui-AboutWalkDialogContent'),
    ).not.toBeNull()
    expect(container.innerHTML).not.toContain('undefined')
  })
})

describe('DguideWalksApp 的語言設定', () => {
  beforeEach(() => {
    jest.mocked(applyFixedLanguage).mockClear()
    window.localStorage.clear()
  })

  it('沒傳 language 時不會進固定語言模式', () => {
    setup({})
    expect(applyFixedLanguage).not.toHaveBeenCalled()
  })

  it('傳 language 時固定該語言，且不走 defaultLanguage 的首次套用旗標', () => {
    setup({}, { appProps: { language: 'zh-TW', defaultLanguage: 'en' } })
    expect(applyFixedLanguage).toHaveBeenCalledWith('zh-TW')
    expect(window.localStorage.getItem('dui-i18n-default-applied')).toBeNull()
  })

  it('只傳 defaultLanguage 時維持原本的首次套用行為', () => {
    setup({}, { appProps: { defaultLanguage: 'en' } })
    expect(applyFixedLanguage).not.toHaveBeenCalled()
    expect(window.localStorage.getItem('dui-i18n-default-applied')).toBe('1')
  })
})
