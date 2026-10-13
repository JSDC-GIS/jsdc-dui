import { act, render, waitFor } from '@testing-library/react'
import React, { useContext } from 'react'
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import { WalkViewerAssets } from '../../JSDC/Dguidewalks/ApiProvider'
import { SceneConfig } from '../../hooks/useSceneController'
import { resetPreloadedImages } from '../../utils/preloadImage'
import {
  DuiContext,
  DuiContextProvider,
  DuiContextType,
  IDuiContextProviderProps,
} from '.'

// chroma-js 是 ESM，jest 不轉譯 node_modules；主題不在這裡測
jest.mock('chroma-js', () => ({ __esModule: true, default: () => ({}) }))
jest.mock('./Theme/useTheme', () => ({
  __esModule: true,
  default: () => undefined,
  defaultStyle: {},
}))
// 景點的內建行為有自己的測試；這裡只看 DuiContextProvider 交給它的設定
jest.mock('../../hooks/useSceneController', () => ({
  __esModule: true,
  default: (config: object) => ({ config }),
}))

// jsdom 的 Image 不會真的載圖：用假的 Image 控制預載什麼時候成功、失敗
type FakeImage = { src: string; onload?: () => void; onerror?: () => void }
let fakeImages: FakeImage[] = []
let imageMode: 'load' | 'error' | 'manual' = 'load'
const settleImages = async (
  kind: 'load' | 'error',
  match: (src: string) => boolean = () => true,
) => {
  await act(async () => {
    fakeImages
      .filter((image) => match(image.src))
      .forEach((image) => (kind === 'load' ? image.onload : image.onerror)?.())
    fakeImages = fakeImages.filter((image) => !match(image.src))
    await Promise.resolve()
  })
}
const preloadedUrls: string[] = []
let warnSpy: jest.SpyInstance
const OriginalImage = global.Image

beforeEach(() => {
  resetPreloadedImages()
  fakeImages = []
  preloadedUrls.length = 0
  imageMode = 'load'
  ;(global as any).Image = class {
    onload?: () => void
    onerror?: () => void
    private _src = ''
    get src() {
      return this._src
    }
    set src(value: string) {
      this._src = value
      preloadedUrls.push(value)
      fakeImages.push(this)
    }
  }
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
})

afterEach(() => {
  ;(global as any).Image = OriginalImage
  warnSpy.mockRestore()
})

const STRAPI = {
  headerDesktop: 'https://strapi.test/key-art_Desktop.png',
  headerMobile: 'https://strapi.test/key-art_mobile.jpg',
  about: 'https://strapi.test/about.png',
  logo: 'https://strapi.test/logo.png',
  appleTouchIcon: 'https://strapi.test/apple-touch-icon.png',
  favicon: 'https://strapi.test/favicon.ico',
}

const PROPS = {
  headerDImgSrc: '/static/key-art_Desktop.png',
  headerMBImgSrc: '/static/key-art_mobile.jpg',
  aboutWalkImgSrc: '/static/about.png',
}

const CATEGORIES = [
  { name: '人文地景' },
  { name: '新的類別' },
  { name: '商店' },
]

type SetupOptions = {
  props?: Partial<IDuiContextProviderProps>
  /** `/walks` 回應裡的 viewerAssets；'absent' 表示沒有這個欄位。 */
  viewerAssets?: Partial<WalkViewerAssets> | null | 'absent'
  categories?: unknown
  failed?: boolean
}

const setup = ({
  props = {},
  viewerAssets = 'absent',
  failed = false,
  ...rest
}: SetupOptions = {}) => {
  // 明確傳 undefined 也要算數，所以不能用預設參數
  const categories = 'categories' in rest ? rest.categories : CATEGORIES
  let settle: () => void = () => undefined
  const walk = {
    code: 'n0004',
    categories,
    ...(viewerAssets === 'absent' ? {} : { viewerAssets }),
  }
  const walkPromise = new Promise((resolve, reject) => {
    settle = () => (failed ? reject(new Error('walk failed')) : resolve(walk))
  })
  walkPromise.catch(() => undefined)
  const dgw = { walk: undefined, loadWalk: jest.fn(() => walkPromise) }
  const ref: { dui?: DuiContextType } = {}
  const Probe = () => {
    ref.dui = useContext(DuiContext)
    return null
  }
  render(
    <DguidewalksContext.Provider value={{ dgw } as any}>
      <DuiContextProvider
        sidebarTitle=""
        sidebarSubtitle=""
        aboutWalkContent=""
        credit=""
        weatherConfig={{ disabled: true, token: undefined, locations: [] }}
        {...props}
      >
        <Probe />
      </DuiContextProvider>
    </DguidewalksContext.Provider>,
  )
  const images = () => ({
    headerDImgSrc: ref.dui!.headerDImgSrc,
    headerMBImgSrc: ref.dui!.headerMBImgSrc,
    aboutWalkImgSrc: ref.dui!.aboutWalkImgSrc,
  })
  const kanban = () =>
    (ref.dui!.scene.config as SceneConfig).checkinKanbanImgSrc
  /** 讓 /walks 回來，並等 React 更新完。 */
  const load = async () => {
    await act(async () => {
      settle()
      await walkPromise.catch(() => undefined)
    })
    await waitFor(() => expect(ref.dui!.legendReady).toBe(true))
    // 預設讓 Strapi 的圖都預載成功；'manual' 時由測試自己決定
    if (imageMode !== 'manual') await settleImages(imageMode)
  }
  return { dui: () => ref.dui!, dgw, images, kanban, load }
}

const headLinks = () =>
  Array.from(document.head.querySelectorAll('link')).map((link) => [
    link.getAttribute('rel'),
    link.getAttribute('href'),
  ])

describe('DuiContextProvider 的三張圖（viewerAssets 與 prop 的 fallback）', () => {
  it('/walks 回來之前先顯示 prop', () => {
    const { images, kanban } = setup({ props: PROPS, viewerAssets: STRAPI })
    expect(images()).toEqual(PROPS)
    expect(kanban()).toBe(PROPS.headerMBImgSrc)
  })

  it('載入後換成 Strapi 的；只用同一次 loadWalk', async () => {
    const { images, load, dgw } = setup({ props: PROPS, viewerAssets: STRAPI })
    await load()
    expect(images()).toEqual({
      headerDImgSrc: STRAPI.headerDesktop,
      headerMBImgSrc: STRAPI.headerMobile,
      aboutWalkImgSrc: STRAPI.about,
    })
    expect(dgw.loadWalk).toHaveBeenCalledTimes(1)
  })

  it.each<[string, SetupOptions['viewerAssets']]>([
    ['不存在', 'absent'],
    ['是 null', null],
    ['欄位都是 null', { headerDesktop: null, headerMobile: null, about: null }],
  ])('viewerAssets %s：載入後仍然是 prop，畫面不變', async (_title, value) => {
    const { images, kanban, load } = setup({
      props: PROPS,
      viewerAssets: value,
    })
    await load()
    expect(images()).toEqual(PROPS)
    expect(kanban()).toBe(PROPS.headerMBImgSrc)
  })

  it('只有部分欄位有值：有的換成 Strapi，沒有的維持 prop', async () => {
    const { images, load } = setup({
      props: PROPS,
      viewerAssets: {
        headerDesktop: null,
        headerMobile: '',
        about: STRAPI.about,
      },
    })
    await load()
    expect(images()).toEqual({ ...PROPS, aboutWalkImgSrc: STRAPI.about })
  })

  it('下游沒傳 prop：載入前沒有圖（空字串），載入後用 Strapi 的', async () => {
    const { images, kanban, load } = setup({ viewerAssets: STRAPI })
    expect(images()).toEqual({
      headerDImgSrc: '',
      headerMBImgSrc: '',
      aboutWalkImgSrc: '',
    })
    expect(kanban()).toBeUndefined()
    await load()
    expect(images().headerDImgSrc).toBe(STRAPI.headerDesktop)
    expect(kanban()).toBe(STRAPI.headerMobile)
  })

  it('兩者都沒有：一直是空字串，集章對話框也沒有圖', async () => {
    const { images, kanban, load } = setup()
    await load()
    expect(images()).toEqual({
      headerDImgSrc: '',
      headerMBImgSrc: '',
      aboutWalkImgSrc: '',
    })
    expect(kanban()).toBeUndefined()
  })

  it('/walks 失敗時維持 prop', async () => {
    const { images, load } = setup({ props: PROPS, failed: true })
    await load()
    expect(images()).toEqual(PROPS)
  })
})

describe('DuiContextProvider 的集章對話框圖（checkinKanbanImgSrc）', () => {
  it('下游有明確傳：一律用下游的，不被 Strapi 或橫幅蓋掉；其他 sceneConfig 原樣保留', async () => {
    const { kanban, dui, load } = setup({
      props: {
        ...PROPS,
        sceneConfig: {
          checkinKanbanImgSrc: '/static/kanban.png',
          cluster: false,
        },
      },
      viewerAssets: STRAPI,
    })
    expect(kanban()).toBe('/static/kanban.png')
    await load()
    expect(kanban()).toBe('/static/kanban.png')
    expect((dui().scene.config as SceneConfig).cluster).toBe(false)
  })

  it('下游沒傳：用算好的手機版橫幅（Strapi 有值用 Strapi，否則 headerMBImgSrc）', async () => {
    const withStrapi = setup({
      props: { ...PROPS, sceneConfig: { cluster: false } },
      viewerAssets: STRAPI,
    })
    expect(withStrapi.kanban()).toBe(PROPS.headerMBImgSrc)
    await withStrapi.load()
    expect(withStrapi.kanban()).toBe(STRAPI.headerMobile)

    const withoutStrapi = setup({ props: PROPS, viewerAssets: null })
    await withoutStrapi.load()
    expect(withoutStrapi.kanban()).toBe(PROPS.headerMBImgSrc)
  })
})

describe('DuiContextProvider 的 <head> 圖示', () => {
  const DOWNSTREAM_HEAD =
    '<link rel="icon" href="/logo.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">'

  beforeEach(() => {
    document.head.innerHTML = DOWNSTREAM_HEAD
  })
  afterEach(() => {
    document.head.innerHTML = ''
  })

  it('viewerAssets 沒有值時完全不動', async () => {
    const { load } = setup({ props: PROPS, viewerAssets: null })
    await load()
    expect(document.head.innerHTML).toBe(DOWNSTREAM_HEAD)
  })

  it('載入前不動，載入後換成 Strapi 的網址', async () => {
    const { load } = setup({ props: PROPS, viewerAssets: STRAPI })
    expect(document.head.innerHTML).toBe(DOWNSTREAM_HEAD)
    await load()
    expect(headLinks()).toEqual([
      ['icon', STRAPI.logo],
      ['apple-touch-icon', STRAPI.appleTouchIcon],
    ])
  })

  it('fallback 順序：沒有 logo 用 favicon；沒有 appleTouchIcon 用 logo', async () => {
    const first = setup({ viewerAssets: { favicon: STRAPI.favicon } })
    await first.load()
    expect(headLinks()).toEqual([
      ['icon', STRAPI.favicon],
      ['apple-touch-icon', '/apple-touch-icon.png'],
    ])

    document.head.innerHTML = DOWNSTREAM_HEAD
    const second = setup({ viewerAssets: { logo: STRAPI.logo } })
    await second.load()
    expect(headLinks()).toEqual([
      ['icon', STRAPI.logo],
      ['apple-touch-icon', STRAPI.logo],
    ])
  })
})

describe('DuiContextProvider 的圖例（legendConfig）', () => {
  it('legendConfig 整個不傳：跟著 categories，圖例沒有的類別忽略；載入前先標成未就緒', async () => {
    const { dui, load } = setup()
    expect(dui().legendReady).toBe(false)
    expect(dui().legendConfig.activeLegends).toEqual([])
    await load()
    expect(dui().legendReady).toBe(true)
    expect(dui().legendConfig.activeLegends).toEqual(['人文地景', '商店'])
    expect(dui().legendConfig.disabled).toBeUndefined()
  })

  it('沒傳 activeLegends（只傳 disabled）：一樣跟著 categories，disabled 保留', async () => {
    const { dui, load } = setup({ props: { legendConfig: { disabled: true } } })
    await load()
    expect(dui().legendConfig).toEqual({
      disabled: true,
      activeLegends: ['人文地景', '商店'],
    })
  })

  it('有傳 activeLegends：照下游的，不等 /walks、載入後也不被 categories 蓋掉', async () => {
    const { dui, load } = setup({
      props: { legendConfig: { activeLegends: ['聚落'] } },
    })
    expect(dui().legendReady).toBe(true)
    expect(dui().legendConfig.activeLegends).toEqual(['聚落'])
    await load()
    expect(dui().legendConfig.activeLegends).toEqual(['聚落'])
  })

  it('傳空陣列也算有傳（全部灰色）', async () => {
    const { dui, load } = setup({
      props: { legendConfig: { activeLegends: [] } },
    })
    expect(dui().legendReady).toBe(true)
    await load()
    expect(dui().legendConfig.activeLegends).toEqual([])
  })

  it.each([[undefined], [null], ['oops']])(
    'categories 壞掉（%p）時不壞，全部灰色',
    async (categories) => {
      const { dui, load } = setup({ categories })
      await load()
      expect(dui().legendConfig.activeLegends).toEqual([])
    },
  )

  it('/walks 失敗：就緒但沒有類別（全部灰色），不會永遠停在未就緒', async () => {
    const { dui, load } = setup({ failed: true })
    await load()
    expect(dui().legendReady).toBe(true)
    expect(dui().legendConfig.activeLegends).toEqual([])
  })
})

describe('DuiContextProvider 放在 DguidewalksProvider 外面', () => {
  it('沒有 dgw 也不壞，圖片用 prop', () => {
    const ref: { dui?: DuiContextType } = {}
    const Probe = () => {
      ref.dui = useContext(DuiContext)
      return null
    }
    render(
      <DuiContextProvider
        sidebarTitle=""
        sidebarSubtitle=""
        aboutWalkContent=""
        credit=""
        weatherConfig={{ disabled: true, token: undefined, locations: [] }}
        {...PROPS}
      >
        <Probe />
      </DuiContextProvider>,
    )
    expect(ref.dui!.headerMBImgSrc).toBe(PROPS.headerMBImgSrc)
  })
})

describe('DuiContextProvider 換圖前先預載', () => {
  const strapiImages = {
    headerDImgSrc: STRAPI.headerDesktop,
    headerMBImgSrc: STRAPI.headerMobile,
    aboutWalkImgSrc: STRAPI.about,
  }
  // 只給三張圖（沒有 logo），manifest 那條路不會跑，warn 只會來自預載
  const IMAGES_ONLY = {
    headerDesktop: STRAPI.headerDesktop,
    headerMobile: STRAPI.headerMobile,
    about: STRAPI.about,
  }

  it('/walks 回來後先預載，載入成功之前仍顯示下游的圖，成功才換', async () => {
    imageMode = 'manual'
    const { images, kanban, load } = setup({
      props: PROPS,
      viewerAssets: IMAGES_ONLY,
    })
    expect(preloadedUrls).toEqual([])
    await load()
    // 只預載會顯示在畫面上的三張，圖示不預載
    expect(preloadedUrls).toEqual([
      STRAPI.headerDesktop,
      STRAPI.headerMobile,
      STRAPI.about,
    ])
    expect(images()).toEqual(PROPS)
    expect(kanban()).toBe(PROPS.headerMBImgSrc)

    // 一張一張載完，各自換
    await settleImages('load', (src) => src === STRAPI.headerMobile)
    expect(images()).toEqual({ ...PROPS, headerMBImgSrc: STRAPI.headerMobile })
    expect(kanban()).toBe(STRAPI.headerMobile)
    await settleImages('load')
    expect(images()).toEqual(strapiImages)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('載入失敗的那張維持下游的圖並 warn 一次，其他照常換', async () => {
    imageMode = 'manual'
    const { images, kanban, load } = setup({
      props: PROPS,
      viewerAssets: IMAGES_ONLY,
    })
    await load()
    await settleImages('error', (src) => src === STRAPI.headerMobile)
    await settleImages('load')
    expect(images()).toEqual({
      ...strapiImages,
      headerMBImgSrc: PROPS.headerMBImgSrc,
    })
    expect(kanban()).toBe(PROPS.headerMBImgSrc)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain(STRAPI.headerMobile)
  })

  it('下游沒有 fallback：載入中、載入失敗都沒有圖（空字串），載完才出現', async () => {
    imageMode = 'manual'
    const { images, kanban, load } = setup({ viewerAssets: IMAGES_ONLY })
    await load()
    const none = { headerDImgSrc: '', headerMBImgSrc: '', aboutWalkImgSrc: '' }
    expect(images()).toEqual(none)
    expect(kanban()).toBeUndefined()
    await settleImages('error', (src) => src === STRAPI.about)
    await settleImages('load')
    expect(images()).toEqual({ ...strapiImages, aboutWalkImgSrc: '' })
    expect(kanban()).toBe(STRAPI.headerMobile)
  })

  it.each<[string, SetupOptions['viewerAssets']]>([
    ['不存在', 'absent'],
    ['是 null', null],
    ['欄位都是 null', { headerDesktop: null, headerMobile: null, about: null }],
    ['只有圖示', { logo: STRAPI.logo, favicon: STRAPI.favicon }],
  ])('viewerAssets %s：完全不觸發預載', async (_title, viewerAssets) => {
    const { images, load } = setup({ props: PROPS, viewerAssets })
    await load()
    expect(preloadedUrls).toEqual([])
    expect(images()).toEqual(PROPS)
  })

  it('同一張圖只預載一次：重新渲染、另一個 provider 重掛都不會再下載，重掛時直接是 Strapi 的圖', async () => {
    const first = setup({ props: PROPS, viewerAssets: IMAGES_ONLY })
    await first.load()
    expect(preloadedUrls).toHaveLength(3)
    // 選單開關會讓 provider 重新渲染
    act(() => first.dui().menuSwitch('地圖圖層'))
    act(() => first.dui().menuSwitch(undefined))
    expect(preloadedUrls).toHaveLength(3)

    imageMode = 'manual'
    const second = setup({ props: PROPS, viewerAssets: IMAGES_ONLY })
    await second.load()
    expect(preloadedUrls).toHaveLength(3)
    expect(second.images()).toEqual(strapiImages)
  })
})

describe('DuiContextProvider 的 manifest', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    delete (global as any).fetch
  })

  it('viewerAssets 有 logo 時把 <link rel="manifest"> 換成新的 manifest；沒有 logo 時不動', async () => {
    const createObjectURL = jest.fn(() => 'blob:http://localhost/new-manifest')
    ;(URL as any).createObjectURL = createObjectURL
    ;(global as any).fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ name: 'demo', start_url: '.' }),
    }))
    const link = () =>
      document.head.querySelector('link[rel="manifest"]')!.getAttribute('href')

    document.head.innerHTML =
      '<link rel="manifest" href="/n0028/manifest.json">'
    const without = setup({ viewerAssets: { about: STRAPI.about } })
    await without.load()
    expect(link()).toBe('/n0028/manifest.json')
    expect((global as any).fetch).not.toHaveBeenCalled()

    const withLogo = setup({ viewerAssets: STRAPI })
    await withLogo.load()
    await waitFor(() =>
      expect(link()).toBe('blob:http://localhost/new-manifest'),
    )
    expect((global as any).fetch).toHaveBeenCalledTimes(1)
    // 圖示（logo、appleTouchIcon、favicon）不預載，只預載會顯示在畫面上的三張
    expect([...preloadedUrls].sort()).toEqual(
      [STRAPI.headerDesktop, STRAPI.headerMobile, STRAPI.about].sort(),
    )
    delete (URL as any).createObjectURL
  })
})
