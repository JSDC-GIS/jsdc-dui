import { act, render } from '@testing-library/react'
import React from 'react'
import { JSDCContext } from '../../JSDC/Context'
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import { PathColorItem } from '../../JSDC/Dguidewalks/mapLayers'
import Event from '../../JSDC/utils/Event'
import { DuiContext, PathColorConfig } from '../Context'
import DguideWalksApp from '.'

let mockLanguage = 'zh-TW'
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: mockLanguage, changeLanguage: () => undefined },
  }),
}))
// chroma-js 是 ESM，jest 不轉譯 node_modules；這裡只用到 DuiContext，不會真的呼叫它
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
    settingConfig: {},
    pathColorConfig,
  }
  const { container } = render(
    <JSDCContext.Provider value={{ Jsdc: {}, layerInfos } as any}>
      <DguidewalksContext.Provider
        value={{ dgw, layerLegendImages: {}, layerNames: {} } as any}
      >
        <DuiContext.Provider value={dui as any}>
          <DguideWalksApp />
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
  return { titles, rows, finishLoading, layerNames }
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
