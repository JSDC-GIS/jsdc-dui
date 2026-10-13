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

// viewerAssets 整個不存在、是 null、個別欄位是 null 或空字串，都當成「沒有」
const pickAsset = (value: unknown) =>
  typeof value === 'string' && value.trim() !== '' ? value : undefined

/**
 * 三張圖各自的來源：`viewerAssets` 對應欄位有值就用它，否則用下游傳的 prop。
 * `headerDesktop` ↔ `headerDImgSrc`、`headerMobile` ↔ `headerMBImgSrc`、`about` ↔ `aboutWalkImgSrc`。
 * `/walks` 回來之前 `viewerAssets` 是 undefined，結果就是 prop。
 */
export const resolveViewerImages = (
  viewerAssets: WalkViewerAssets | null | undefined,
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
 * 只處理這兩種 `<link>`，`manifest.json` 是靜態檔，不處理。
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
