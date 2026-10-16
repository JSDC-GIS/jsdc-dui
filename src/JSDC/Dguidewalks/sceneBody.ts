import DOMPurify from 'dompurify'

/** 景點內文只允許嵌入 Google 地圖（s0007 有街景）；其他來源的 iframe 一律拿掉。 */
const ALLOWED_IFRAME_SRC = 'https://www.google.com/maps/embed'
const IFRAME_TITLE = 'Google 地圖'

let purifier: ReturnType<typeof DOMPurify> | undefined

// 用獨立的 instance 掛 hook，不影響下游自己用的 DOMPurify
function getPurifier() {
  if (purifier) return purifier
  purifier = DOMPurify(window)
  purifier.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) return
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      // 內文的連結都是外部參考資料，開新分頁，不要把圖台換掉
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
    if (node.tagName === 'IFRAME') {
      const src = node.getAttribute('src') ?? ''
      if (!src.startsWith(ALLOWED_IFRAME_SRC)) {
        node.remove()
        return
      }
      // WCAG：iframe 要有 title
      if (!node.getAttribute('title')) node.setAttribute('title', IFRAME_TITLE)
      node.setAttribute('loading', 'lazy')
    }
  })
  return purifier
}

const HTML_TAG = /<[a-z][\w-]*(\s[^>]*)?\/?>/i

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 純文字（`summary`、約 330 個景點的 `body`）轉成 HTML：
 * 空行分段成 `<p>`，段內的單一換行變 `<br>`。
 */
export function plainTextToHtml(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph).replace(/[ \t]*\n[ \t]*/g, '<br>')}</p>`,
    )
    .join('')
}

/**
 * 景點內文（Strapi `body`／`bodyEn`／`summary`）轉成可以直接放進 DOM 的 HTML。
 *
 * - 沒有 HTML 標籤就當純文字處理（`plainTextToHtml`）。
 * - 有標籤就用 DOMPurify 過濾：`style`、`class` 保留；連結開新分頁；
 *   iframe 只留 Google 地圖並補 `title`。相對網址不改寫（v10 請後端改成完整網址）。
 */
export function toSceneContentHtml(raw: string | null | undefined) {
  const text = raw?.trim()
  if (!text) return ''
  if (!HTML_TAG.test(text)) return plainTextToHtml(text)
  return getPurifier().sanitize(text, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allowfullscreen', 'loading', 'referrerpolicy'],
  }) as string
}
