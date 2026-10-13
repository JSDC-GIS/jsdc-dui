export type StyleType = {
  [k: string]: string
}

const useCssVariable = (style: StyleType) => {
  return style
}

export default useCssVariable

/** 背景圖用的 CSS 值。沒有圖時回傳 `none`，不會變成 `url(undefined)` 去請求一個不存在的檔案。 */
export const cssUrl = (src?: string | null) =>
  src ? `url(${JSON.stringify(src)})` : 'none'
