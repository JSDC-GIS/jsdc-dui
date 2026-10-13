import { LegendName, legendFilenames } from '../../icon'
import { SceneCategory, WalkViewerAssets } from './ApiProvider'

/** 下游傳給 `DuiContextProvider` 的三張圖，角色是 Strapi 沒有圖時的 fallback。 */
export type ViewerImageFallbacks = {
  headerDImgSrc?: string
  headerMBImgSrc?: string
  aboutWalkImgSrc?: string
}

/** 實際要顯示的三張圖。沒有圖時是空字串（呼叫端據此不渲染，不會出現破圖）。 */
export type ViewerImages = {
  headerDImgSrc: string
  headerMBImgSrc: string
  aboutWalkImgSrc: string
}

/** `<head>` 裡要換上的圖示網址；undefined 表示不動。 */
export type ViewerHeadIcons = {
  icon?: string
  appleTouchIcon?: string
}

/** `viewerAssets` 裡會顯示在畫面上的三張圖；沒有值的欄位是 null。 */
export type ViewerImageAssets = Pick<
  WalkViewerAssets,
  'headerDesktop' | 'headerMobile' | 'about'
>

/** web app manifest 的一筆 `icons`。 */
export type ViewerManifestIcon = {
  src: string
  sizes: string
  type: string
}

// viewerAssets 整個不存在、是 null、個別欄位是 null 或空字串，都當成「沒有」
const pickAsset = (value: unknown) =>
  typeof value === 'string' && value.trim() !== '' ? value : undefined

/** 取出三張圖的網址，沒有值（不存在、null、空字串）的一律整理成 null。預載用。 */
export const pickViewerImageAssets = (
  viewerAssets: Partial<WalkViewerAssets> | null | undefined,
): ViewerImageAssets => ({
  headerDesktop: pickAsset(viewerAssets?.headerDesktop) ?? null,
  headerMobile: pickAsset(viewerAssets?.headerMobile) ?? null,
  about: pickAsset(viewerAssets?.about) ?? null,
})

/**
 * 三張圖各自的來源：`viewerAssets` 對應欄位有值就用它，否則用下游傳的 prop。
 * `headerDesktop` ↔ `headerDImgSrc`、`headerMobile` ↔ `headerMBImgSrc`、`about` ↔ `aboutWalkImgSrc`。
 * `/walks` 回來之前 `viewerAssets` 是 undefined，結果就是 prop。
 */
export const resolveViewerImages = (
  viewerAssets: Partial<WalkViewerAssets> | null | undefined,
  fallbacks: ViewerImageFallbacks = {},
): ViewerImages => ({
  headerDImgSrc:
    pickAsset(viewerAssets?.headerDesktop) ??
    pickAsset(fallbacks.headerDImgSrc) ??
    '',
  headerMBImgSrc:
    pickAsset(viewerAssets?.headerMobile) ??
    pickAsset(fallbacks.headerMBImgSrc) ??
    '',
  aboutWalkImgSrc:
    pickAsset(viewerAssets?.about) ??
    pickAsset(fallbacks.aboutWalkImgSrc) ??
    '',
})

/**
 * `<head>` 圖示的來源：`rel="icon"` 用 `logo`，沒有才用 `favicon`；
 * `rel="apple-touch-icon"` 用 `appleTouchIcon`，沒有才用 `logo`。都沒有就是 undefined（不動）。
 */
export const resolveViewerHeadIcons = (
  viewerAssets: WalkViewerAssets | null | undefined,
): ViewerHeadIcons => ({
  icon: pickAsset(viewerAssets?.logo) ?? pickAsset(viewerAssets?.favicon),
  appleTouchIcon:
    pickAsset(viewerAssets?.appleTouchIcon) ?? pickAsset(viewerAssets?.logo),
})

const setHeadLinks = (
  doc: Document,
  selector: string,
  rel: string,
  href: string | undefined,
  resetType: boolean,
) => {
  if (!href) return
  const links = Array.from(doc.head.querySelectorAll<HTMLLinkElement>(selector))
  if (links.length === 0) {
    const link = doc.createElement('link')
    link.rel = rel
    link.href = href
    doc.head.appendChild(link)
    return
  }
  links.forEach((link) => {
    // 原本的 type（例如 image/x-icon）不一定符合新的圖檔，拿掉讓瀏覽器自己判斷
    resetType && link.removeAttribute('type')
    link.href = href
  })
}

/**
 * 把 `<head>` 裡的 `<link rel="icon">`（含 `shortcut icon`）與 `<link rel="apple-touch-icon">`
 * 換成指定的網址；頁面上沒有對應的 `<link>` 時補一個。值是 undefined 的那一種完全不動。
 * 只處理這兩種 `<link>`；`<link rel="manifest">` 見 `applyViewerManifest`。
 */
export const applyViewerHeadIcons = (
  icons: ViewerHeadIcons,
  doc: Document = document,
) => {
  // `rel~="icon"` 比對的是以空白分隔的 token：會中 `icon`、`shortcut icon`，不會中 `apple-touch-icon`
  setHeadLinks(doc, 'link[rel~="icon"]', 'icon', icons.icon, true)
  setHeadLinks(
    doc,
    'link[rel~="apple-touch-icon"]',
    'apple-touch-icon',
    icons.appleTouchIcon,
    false,
  )
}

/**
 * manifest 的圖示：`logo`（192×192 PNG）一定要有，`appleTouchIcon`（180×180 PNG）有值才放；
 * `favicon` 是 ICO，不放。沒有 `logo` 時是空陣列（不動下游的 manifest）。
 */
export const resolveViewerManifestIcons = (
  viewerAssets: Partial<WalkViewerAssets> | null | undefined,
): ViewerManifestIcon[] => {
  const logo = pickAsset(viewerAssets?.logo)
  if (!logo) return []
  const appleTouchIcon = pickAsset(viewerAssets?.appleTouchIcon)
  return [
    { src: logo, sizes: '192x192', type: 'image/png' },
    ...(appleTouchIcon
      ? [{ src: appleTouchIcon, sizes: '180x180', type: 'image/png' }]
      : []),
  ]
}

const isPlainObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value)

// 相對網址以原本 manifest 的網址為基準解析成絕對網址；不是字串或解析不了的原樣留著
const toAbsoluteUrl = (value: unknown, baseUrl: string) => {
  if (typeof value !== 'string') return value
  try {
    return new URL(value, baseUrl).href
  } catch (error) {
    return value
  }
}

const resolveUrlFields = (
  item: unknown,
  keys: string[],
  baseUrl: string,
): unknown => {
  if (!isPlainObject(item)) return item
  const resolved = { ...item }
  keys.forEach((key) => {
    if (key in resolved) resolved[key] = toAbsoluteUrl(resolved[key], baseUrl)
  })
  return resolved
}

/**
 * 以下游現有的 manifest 為底，把 `icons` 換成 Strapi 的圖示，其餘欄位原樣保留。
 * 新的 manifest 會用 Blob URL 提供，相對網址會失去基準，所以 `start_url`、`scope`
 * 以及保留下來的相對 `src` / `url`（`screenshots`、`shortcuts`）先以原本 manifest 的網址
 * （`manifestUrl`，絕對網址）解析成絕對網址。沒有 `logo`、或 `manifest` 不是物件時回傳 undefined。
 */
export const buildViewerManifest = (
  manifest: unknown,
  manifestUrl: string,
  viewerAssets: Partial<WalkViewerAssets> | null | undefined,
): Record<string, any> | undefined => {
  const icons = resolveViewerManifestIcons(viewerAssets)
  if (icons.length === 0 || !isPlainObject(manifest)) return undefined
  const result: Record<string, any> = { ...manifest, icons }
  ;['start_url', 'scope'].forEach((key) => {
    if (key in result) result[key] = toAbsoluteUrl(result[key], manifestUrl)
  })
  if (Array.isArray(result.screenshots)) {
    result.screenshots = result.screenshots.map((item: unknown) =>
      resolveUrlFields(item, ['src'], manifestUrl),
    )
  }
  if (Array.isArray(result.shortcuts)) {
    result.shortcuts = result.shortcuts.map((item: unknown) => {
      const shortcut = resolveUrlFields(item, ['url'], manifestUrl)
      if (!isPlainObject(shortcut) || !Array.isArray(shortcut.icons)) {
        return shortcut
      }
      return {
        ...shortcut,
        icons: shortcut.icons.map((icon: unknown) =>
          resolveUrlFields(icon, ['src'], manifestUrl),
        ),
      }
    })
  }
  return result
}

/** 已經換過的 `<link rel="manifest">` 會帶這個屬性，值是原本的 manifest 網址。 */
export const VIEWER_MANIFEST_ATTRIBUTE = 'data-dui-viewer-manifest'

/**
 * 讓「加到主畫面」的圖示跟著 Strapi：抓 `<link rel="manifest">` 指到的下游 manifest，
 * 用 `buildViewerManifest` 換掉 `icons`，再把 `<link>` 指向新內容的 Blob URL。
 * 頁面沒有 `<link rel="manifest">`、抓不到、不是合法的 JSON 物件時只 `console.warn`，
 * 沒有 `logo` 時連警告都沒有——這些情況都完全不動原本的 `<link>`。
 * 每個 `<link>` 只換一次（換過的再呼叫不會重抓）。回傳是否有換。
 */
export const applyViewerManifest = async (
  viewerAssets: Partial<WalkViewerAssets> | null | undefined,
  doc: Document = document,
): Promise<boolean> => {
  if (resolveViewerManifestIcons(viewerAssets).length === 0) return false
  const link = doc.head.querySelector<HTMLLinkElement>('link[rel~="manifest"]')
  if (!link || !link.getAttribute('href')) {
    console.warn(
      '[viewer assets]: no <link rel="manifest"> on the page, manifest icons not updated',
    )
    return false
  }
  if (link.hasAttribute(VIEWER_MANIFEST_ATTRIBUTE)) return false
  // 先標記，同時間的第二次呼叫不會重抓；失敗時再拿掉
  const manifestUrl = link.href
  link.setAttribute(VIEWER_MANIFEST_ATTRIBUTE, manifestUrl)
  try {
    const resp = await fetch(manifestUrl)
    if (!resp.ok) throw new Error(`${resp.status} ${manifestUrl}`)
    const manifest = buildViewerManifest(
      await resp.json(),
      manifestUrl,
      viewerAssets,
    )
    if (!manifest) throw new Error(`not a JSON object: ${manifestUrl}`)
    const blob = new Blob([JSON.stringify(manifest)], {
      type: 'application/manifest+json',
    })
    link.href = URL.createObjectURL(blob)
    return true
  } catch (error) {
    link.removeAttribute(VIEWER_MANIFEST_ATTRIBUTE)
    console.warn(
      '[viewer assets]: failed to rebuild the manifest, keeping the original',
      error,
    )
    return false
  }
}

const isLegendName = (name: unknown): name is LegendName =>
  typeof name === 'string' &&
  Object.prototype.hasOwnProperty.call(legendFilenames, name)

/**
 * 圖例說明要亮起來的類別：`/walks` 的 `categories[].name`（中文類別名稱，不受語系影響）。
 * 只取名稱，不使用 `iconUrl`、`color`、`icon`；圖例沒有的類別名稱忽略。
 */
export const getLegendNamesFromCategories = (
  categories: Array<Pick<SceneCategory, 'name'> | null> | null | undefined,
): LegendName[] => {
  if (!Array.isArray(categories)) return []
  const names = categories
    .map((category) => category?.name)
    .filter(isLegendName)
  return names.filter((name, index) => names.indexOf(name) === index)
}
