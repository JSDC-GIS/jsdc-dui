import { WalkViewerAssets } from './ApiProvider'
import {
  VIEWER_MANIFEST_ATTRIBUTE,
  applyViewerHeadIcons,
  applyViewerManifest,
  buildViewerManifest,
  pickViewerImageAssets,
  resolveViewerManifestIcons,
  getLegendNamesFromCategories,
  resolveViewerHeadIcons,
  resolveViewerImages,
} from './viewerAssets'

const assets = (values: Partial<WalkViewerAssets> = {}): WalkViewerAssets => ({
  headerDesktop: null,
  headerMobile: null,
  about: null,
  logo: null,
  appleTouchIcon: null,
  favicon: null,
  ...values,
})

const fallbacks = {
  headerDImgSrc: '/static/key-art_Desktop.png',
  headerMBImgSrc: '/static/key-art_mobile.jpg',
  aboutWalkImgSrc: '/static/about.png',
}

describe('resolveViewerImages（三張圖的來源）', () => {
  it.each([
    ['不存在（/walks 回來之前、後端尚未實作）', undefined],
    ['是 null', null],
    ['6 個欄位都是 null', assets()],
    [
      '欄位是空字串或空白',
      assets({ headerDesktop: '', headerMobile: '  ', about: '' }),
    ],
    ['不是物件', 'oops' as unknown as WalkViewerAssets],
  ])('viewerAssets %s：三張都用下游的 prop', (_title, viewerAssets) => {
    expect(resolveViewerImages(viewerAssets, fallbacks)).toEqual(fallbacks)
  })

  it('三個欄位都有值：全部用 Strapi 的', () => {
    expect(
      resolveViewerImages(
        assets({
          headerDesktop: 'https://strapi.test/d.png',
          headerMobile: 'https://strapi.test/m.jpg',
          about: 'https://strapi.test/a.png',
        }),
        fallbacks,
      ),
    ).toEqual({
      headerDImgSrc: 'https://strapi.test/d.png',
      headerMBImgSrc: 'https://strapi.test/m.jpg',
      aboutWalkImgSrc: 'https://strapi.test/a.png',
    })
  })

  it('只有部分欄位有值：有的用 Strapi，沒有的各自退回 prop', () => {
    expect(
      resolveViewerImages(
        assets({ headerMobile: 'https://strapi.test/m.jpg' }),
        fallbacks,
      ),
    ).toEqual({
      headerDImgSrc: '/static/key-art_Desktop.png',
      headerMBImgSrc: 'https://strapi.test/m.jpg',
      aboutWalkImgSrc: '/static/about.png',
    })
  })

  it('Strapi 和 prop 都沒有時是空字串（呼叫端不渲染圖）', () => {
    const none = { headerDImgSrc: '', headerMBImgSrc: '', aboutWalkImgSrc: '' }
    expect(resolveViewerImages(undefined)).toEqual(none)
    expect(resolveViewerImages(assets(), {})).toEqual(none)
    expect(
      resolveViewerImages(assets({ about: 'https://strapi.test/a.png' }), {}),
    ).toEqual({ ...none, aboutWalkImgSrc: 'https://strapi.test/a.png' })
  })
})

describe('resolveViewerHeadIcons（<head> 圖示的來源與 fallback 順序）', () => {
  const logo = 'https://strapi.test/logo.png'
  const favicon = 'https://strapi.test/favicon.ico'
  const appleTouchIcon = 'https://strapi.test/apple-touch-icon.png'

  it('icon：logo 優先，沒有才用 favicon', () => {
    expect(resolveViewerHeadIcons(assets({ logo, favicon })).icon).toBe(logo)
    expect(resolveViewerHeadIcons(assets({ favicon })).icon).toBe(favicon)
    expect(resolveViewerHeadIcons(assets({ logo: '', favicon })).icon).toBe(
      favicon,
    )
  })

  it('apple-touch-icon：appleTouchIcon 優先，沒有才用 logo（不用 favicon）', () => {
    expect(
      resolveViewerHeadIcons(assets({ appleTouchIcon, logo })).appleTouchIcon,
    ).toBe(appleTouchIcon)
    expect(resolveViewerHeadIcons(assets({ logo })).appleTouchIcon).toBe(logo)
    expect(
      resolveViewerHeadIcons(assets({ favicon })).appleTouchIcon,
    ).toBeUndefined()
  })

  it.each([[undefined], [null], [assets()]])(
    'viewerAssets 沒有值（%p）時兩個都是 undefined',
    (viewerAssets) => {
      expect(resolveViewerHeadIcons(viewerAssets)).toEqual({
        icon: undefined,
        appleTouchIcon: undefined,
      })
    },
  )
})

describe('applyViewerHeadIcons（替換 <head> 的 <link>）', () => {
  const setHead = (html: string) => {
    document.head.innerHTML = html
  }
  const links = () =>
    Array.from(document.head.querySelectorAll('link')).map((link) => [
      link.getAttribute('rel'),
      link.getAttribute('href'),
    ])
  const DOWNSTREAM_HEAD = `
    <link rel="icon" href="/logo.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="stylesheet" href="/main.css" />`

  afterEach(() => setHead(''))

  it('兩種 link 都換成指定的網址，其他 link 不動', () => {
    setHead(DOWNSTREAM_HEAD)
    applyViewerHeadIcons({
      icon: 'https://strapi.test/logo.png',
      appleTouchIcon: 'https://strapi.test/apple.png',
    })
    expect(links()).toEqual([
      ['icon', 'https://strapi.test/logo.png'],
      ['apple-touch-icon', 'https://strapi.test/apple.png'],
      ['manifest', '/manifest.json'],
      ['stylesheet', '/main.css'],
    ])
  })

  it('沒有值時完全不動（連屬性都不碰）', () => {
    setHead(DOWNSTREAM_HEAD)
    const before = document.head.innerHTML
    applyViewerHeadIcons({})
    applyViewerHeadIcons({ icon: undefined, appleTouchIcon: undefined })
    expect(document.head.innerHTML).toBe(before)
  })

  it('只有其中一種有值時，另一種不動', () => {
    setHead(DOWNSTREAM_HEAD)
    applyViewerHeadIcons({ appleTouchIcon: 'https://strapi.test/apple.png' })
    expect(links().slice(0, 2)).toEqual([
      ['icon', '/logo.png'],
      ['apple-touch-icon', 'https://strapi.test/apple.png'],
    ])
  })

  it('`shortcut icon` 也算 icon；原本的 type 拿掉；多個 icon link 全部換', () => {
    setHead(`
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" sizes="32x32" href="/32X32.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />`)
    applyViewerHeadIcons({ icon: 'https://strapi.test/logo.png' })
    expect(links()).toEqual([
      ['shortcut icon', 'https://strapi.test/logo.png'],
      ['icon', 'https://strapi.test/logo.png'],
      ['apple-touch-icon', '/logo192.png'],
    ])
    expect(document.head.querySelector('link[type]')).toBeNull()
  })

  it('頁面上沒有對應的 link 時補一個', () => {
    setHead('<link rel="manifest" href="/manifest.json" />')
    applyViewerHeadIcons({
      icon: 'https://strapi.test/logo.png',
      appleTouchIcon: 'https://strapi.test/apple.png',
    })
    expect(links()).toEqual([
      ['manifest', '/manifest.json'],
      ['icon', 'https://strapi.test/logo.png'],
      ['apple-touch-icon', 'https://strapi.test/apple.png'],
    ])
    // 再套一次不會重複補
    applyViewerHeadIcons({ icon: 'https://strapi.test/logo.png' })
    expect(links()).toHaveLength(3)
  })
})

describe('getLegendNamesFromCategories（圖例跟著 categories）', () => {
  it('取 categories 的中文名稱，不看 iconUrl / color / icon', () => {
    expect(
      getLegendNamesFromCategories([
        { name: '人文地景', iconUrl: 'https://x.test/a.svg', icon: '99' },
        { name: '商店' },
      ] as any),
    ).toEqual(['人文地景', '商店'])
  })

  it('圖例沒有的類別名稱、壞掉的項目都忽略；重複的只留一個', () => {
    expect(
      getLegendNamesFromCategories([
        { name: '新的類別' },
        { name: '聚落' },
        null,
        {},
        { name: 42 },
        { name: 'toString' },
        { name: '聚落' },
      ] as any),
    ).toEqual(['聚落'])
  })

  it.each([[undefined], [null], ['oops'], [{}]])(
    'categories 不是陣列（%p）時是空的',
    (categories) => {
      expect(getLegendNamesFromCategories(categories as any)).toEqual([])
    },
  )
})

describe('pickViewerImageAssets', () => {
  it('只取三張圖，沒有值的整理成 null', () => {
    expect(
      pickViewerImageAssets(
        assets({
          headerDesktop: 'https://strapi.test/d.png',
          about: ' ',
          logo: 'x',
        }),
      ),
    ).toEqual({
      headerDesktop: 'https://strapi.test/d.png',
      headerMobile: null,
      about: null,
    })
    expect(pickViewerImageAssets(undefined)).toEqual({
      headerDesktop: null,
      headerMobile: null,
      about: null,
    })
  })
})

const LOGO = 'https://strapi.test/map-assets/n0028/logo.png?v=1'
const APPLE = 'https://strapi.test/map-assets/n0028/apple-touch-icon.png?v=1'
const MANIFEST_URL = 'https://map.test/webgis/dguidedwalks/n0028/manifest.json'
const DOWNSTREAM_MANIFEST = {
  short_name: '新竹晶片走讀',
  name: '新竹晶片走讀 數位走讀圖臺',
  icons: [
    { src: 'favicon.ico', sizes: '64x64 32x32', type: 'image/x-icon' },
    { src: 'logo.png', type: 'image/png', sizes: '192x192' },
  ],
  start_url: '.',
  display: 'standalone',
  theme_color: '#000000',
  background_color: '#ffffff',
}

describe('resolveViewerManifestIcons', () => {
  it('有 logo 與 appleTouchIcon：兩個都放（192、180，都是 PNG）；favicon 不放', () => {
    expect(
      resolveViewerManifestIcons(
        assets({
          logo: LOGO,
          appleTouchIcon: APPLE,
          favicon: 'https://x/f.ico',
        }),
      ),
    ).toEqual([
      { src: LOGO, sizes: '192x192', type: 'image/png' },
      { src: APPLE, sizes: '180x180', type: 'image/png' },
    ])
  })

  it('只有 logo：只放 logo', () => {
    expect(resolveViewerManifestIcons(assets({ logo: LOGO }))).toEqual([
      { src: LOGO, sizes: '192x192', type: 'image/png' },
    ])
  })

  it.each([
    [undefined],
    [null],
    [assets()],
    [assets({ logo: '' })],
    [assets({ appleTouchIcon: APPLE, favicon: 'https://x/f.ico' })],
  ])('沒有 logo（%p）時是空的', (viewerAssets) => {
    expect(resolveViewerManifestIcons(viewerAssets)).toEqual([])
  })
})

describe('buildViewerManifest', () => {
  it('icons 換成 Strapi 的，其餘欄位原樣保留', () => {
    const manifest = buildViewerManifest(
      DOWNSTREAM_MANIFEST,
      MANIFEST_URL,
      assets({ logo: LOGO, appleTouchIcon: APPLE }),
    )!
    expect(manifest.icons).toEqual([
      { src: LOGO, sizes: '192x192', type: 'image/png' },
      { src: APPLE, sizes: '180x180', type: 'image/png' },
    ])
    const { icons, start_url, ...rest } = manifest
    const { icons: _i, start_url: _s, ...originalRest } = DOWNSTREAM_MANIFEST
    expect(rest).toEqual(originalRest)
    // 不改動傳入的物件
    expect(DOWNSTREAM_MANIFEST.icons).toHaveLength(2)
    expect(DOWNSTREAM_MANIFEST.start_url).toBe('.')
  })

  it('start_url、scope 以原本 manifest 的網址解析成絕對網址（子路徑部署）', () => {
    const build = (extra: object) =>
      buildViewerManifest(
        { ...DOWNSTREAM_MANIFEST, ...extra },
        MANIFEST_URL,
        assets({ logo: LOGO }),
      )!
    expect(build({}).start_url).toBe(
      'https://map.test/webgis/dguidedwalks/n0028/',
    )
    expect(build({}).scope).toBeUndefined()
    expect(build({ start_url: './?source=pwa', scope: './' })).toMatchObject({
      start_url: 'https://map.test/webgis/dguidedwalks/n0028/?source=pwa',
      scope: 'https://map.test/webgis/dguidedwalks/n0028/',
    })
    expect(build({ start_url: '/', scope: '/webgis/' })).toMatchObject({
      start_url: 'https://map.test/',
      scope: 'https://map.test/webgis/',
    })
    // 已經是絕對網址的不變；不是字串的原樣留著
    expect(build({ start_url: 'https://other.test/app/' }).start_url).toBe(
      'https://other.test/app/',
    )
    expect(build({ start_url: 42 }).start_url).toBe(42)
  })

  it('保留下來的相對 src / url（screenshots、shortcuts）也解析成絕對網址', () => {
    const manifest = buildViewerManifest(
      {
        ...DOWNSTREAM_MANIFEST,
        screenshots: [{ src: 'shot.png', sizes: '540x720' }],
        shortcuts: [
          { name: '景點', url: './?menu=scene', icons: [{ src: 'scene.png' }] },
        ],
      },
      MANIFEST_URL,
      assets({ logo: LOGO }),
    )!
    expect(manifest.screenshots).toEqual([
      {
        src: 'https://map.test/webgis/dguidedwalks/n0028/shot.png',
        sizes: '540x720',
      },
    ])
    expect(manifest.shortcuts).toEqual([
      {
        name: '景點',
        url: 'https://map.test/webgis/dguidedwalks/n0028/?menu=scene',
        icons: [
          { src: 'https://map.test/webgis/dguidedwalks/n0028/scene.png' },
        ],
      },
    ])
  })

  it('沒有 logo、或 manifest 不是物件時回傳 undefined', () => {
    expect(
      buildViewerManifest(DOWNSTREAM_MANIFEST, MANIFEST_URL, assets()),
    ).toBeUndefined()
    expect(
      buildViewerManifest(
        DOWNSTREAM_MANIFEST,
        MANIFEST_URL,
        assets({ appleTouchIcon: APPLE }),
      ),
    ).toBeUndefined()
    ;[null, undefined, 'oops', 42, [DOWNSTREAM_MANIFEST]].forEach((manifest) =>
      expect(
        buildViewerManifest(manifest, MANIFEST_URL, assets({ logo: LOGO })),
      ).toBeUndefined(),
    )
  })
})

describe('applyViewerManifest（替換 <link rel="manifest">）', () => {
  let warnSpy: jest.SpyInstance
  let blobs: Blob[]
  const HEAD =
    '<link rel="icon" href="/logo.png"><link rel="manifest" href="/webgis/dguidedwalks/n0028/manifest.json">'
  const ORIGINAL_URL = `${window.location.origin}/webgis/dguidedwalks/n0028/manifest.json`
  const link = () =>
    document.head.querySelector('link[rel="manifest"]') as HTMLLinkElement
  const mockFetch = (response: () => unknown) => {
    const fetchMock = jest.fn(async () => response())
    ;(global as any).fetch = fetchMock
    return fetchMock
  }
  const okResponse = (body: unknown) => () => ({
    ok: true,
    status: 200,
    json: async () => body,
  })
  const readBlob = (blob: Blob) =>
    new Promise<any>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(JSON.parse(String(reader.result)))
      reader.readAsText(blob)
    })

  beforeEach(() => {
    document.head.innerHTML = HEAD
    blobs = []
    ;(URL as any).createObjectURL = jest.fn((blob: Blob) => {
      blobs.push(blob)
      return `blob:${window.location.origin}/manifest-${blobs.length}`
    })
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    document.head.innerHTML = ''
    delete (URL as any).createObjectURL
    delete (global as any).fetch
    warnSpy.mockRestore()
  })

  it('抓原本的 manifest，換掉 icons 後把 link 指向 Blob URL', async () => {
    const fetchMock = mockFetch(okResponse(DOWNSTREAM_MANIFEST))
    const applied = await applyViewerManifest(
      assets({ logo: LOGO, appleTouchIcon: APPLE }),
    )
    expect(applied).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(ORIGINAL_URL)
    expect(link().getAttribute('href')).toBe(
      `blob:${window.location.origin}/manifest-1`,
    )
    expect(link().getAttribute(VIEWER_MANIFEST_ATTRIBUTE)).toBe(ORIGINAL_URL)
    expect(blobs[0].type).toBe('application/manifest+json')
    const manifest = await readBlob(blobs[0])
    expect(manifest).toEqual({
      ...DOWNSTREAM_MANIFEST,
      icons: [
        { src: LOGO, sizes: '192x192', type: 'image/png' },
        { src: APPLE, sizes: '180x180', type: 'image/png' },
      ],
      start_url: `${window.location.origin}/webgis/dguidedwalks/n0028/`,
    })
    // 其他 link 不動
    expect(
      document.head.querySelector('link[rel="icon"]')!.getAttribute('href'),
    ).toBe('/logo.png')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('沒有 appleTouchIcon 時 icons 只有 logo', async () => {
    mockFetch(okResponse(DOWNSTREAM_MANIFEST))
    await applyViewerManifest(assets({ logo: LOGO }))
    expect((await readBlob(blobs[0])).icons).toEqual([
      { src: LOGO, sizes: '192x192', type: 'image/png' },
    ])
  })

  it('只做一次：換過之後再呼叫（或同時呼叫兩次）不會重抓、不會再換', async () => {
    const fetchMock = mockFetch(okResponse(DOWNSTREAM_MANIFEST))
    const viewerAssets = assets({ logo: LOGO })
    const results = await Promise.all([
      applyViewerManifest(viewerAssets),
      applyViewerManifest(viewerAssets),
    ])
    expect(results).toEqual([true, false])
    expect(await applyViewerManifest(viewerAssets)).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(blobs).toHaveLength(1)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  describe('fallback：完全不動原本的 <link>', () => {
    const expectUntouched = () => {
      expect(document.head.innerHTML).toBe(HEAD)
      expect(blobs).toEqual([])
    }

    it.each([
      [undefined],
      [null],
      [assets()],
      [assets({ appleTouchIcon: APPLE })],
    ])('沒有 logo（%p）：不抓、不 warn', async (viewerAssets) => {
      const fetchMock = mockFetch(okResponse(DOWNSTREAM_MANIFEST))
      expect(await applyViewerManifest(viewerAssets)).toBe(false)
      expect(fetchMock).not.toHaveBeenCalled()
      expect(warnSpy).not.toHaveBeenCalled()
      expectUntouched()
    })

    it('頁面沒有 <link rel="manifest">：warn，不補', async () => {
      document.head.innerHTML = '<link rel="icon" href="/logo.png">'
      const fetchMock = mockFetch(okResponse(DOWNSTREAM_MANIFEST))
      expect(await applyViewerManifest(assets({ logo: LOGO }))).toBe(false)
      expect(fetchMock).not.toHaveBeenCalled()
      expect(document.head.innerHTML).toBe('<link rel="icon" href="/logo.png">')
      expect(warnSpy).toHaveBeenCalledTimes(1)
    })

    it.each<[string, () => unknown]>([
      ['回 404', () => ({ ok: false, status: 404, json: async () => ({}) })],
      [
        '網路錯誤',
        () => {
          throw new TypeError('Failed to fetch')
        },
      ],
      [
        '不是合法的 JSON',
        () => ({
          ok: true,
          status: 200,
          json: async () => {
            throw new SyntaxError('Unexpected token <')
          },
        }),
      ],
      ['JSON 不是物件（陣列）', okResponse([1, 2])],
      ['JSON 是 null', okResponse(null)],
    ])('抓 manifest %s：warn 一次', async (_title, response) => {
      mockFetch(response)
      expect(await applyViewerManifest(assets({ logo: LOGO }))).toBe(false)
      expectUntouched()
      expect(warnSpy).toHaveBeenCalledTimes(1)
    })

    it('失敗後不會留下標記，之後還能再試', async () => {
      mockFetch(() => ({ ok: false, status: 500, json: async () => ({}) }))
      await applyViewerManifest(assets({ logo: LOGO }))
      expect(link().hasAttribute(VIEWER_MANIFEST_ATTRIBUTE)).toBe(false)
      mockFetch(okResponse(DOWNSTREAM_MANIFEST))
      expect(await applyViewerManifest(assets({ logo: LOGO }))).toBe(true)
    })
  })
})
