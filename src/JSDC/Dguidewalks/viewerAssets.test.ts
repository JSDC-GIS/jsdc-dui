import { WalkViewerAssets } from './ApiProvider'
import {
  applyViewerHeadIcons,
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
