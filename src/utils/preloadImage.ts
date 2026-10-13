export type PreloadStatus = 'loading' | 'loaded' | 'failed'

// 以網址為 key，整個頁面共用：同一張圖只下載一次，重新渲染、重掛都不會再觸發
const statuses: Record<string, PreloadStatus> = {}
const promises: Record<string, Promise<boolean>> = {}

/** 這張圖的預載狀態；還沒預載過是 undefined。 */
export const getPreloadStatus = (src: string): PreloadStatus | undefined =>
  Object.prototype.hasOwnProperty.call(statuses, src)
    ? statuses[src]
    : undefined

/**
 * 在背景把圖載完。回傳的 promise 不會 reject：載入成功是 true，
 * 失敗（404、網路錯誤）是 false 並 `console.warn` 一次。
 * 同一個網址重複呼叫會拿到同一個 promise，不會重複下載，失敗的也不會重試。
 */
export const preloadImage = (src: string): Promise<boolean> => {
  if (Object.prototype.hasOwnProperty.call(promises, src)) return promises[src]
  statuses[src] = 'loading'
  promises[src] = new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onload = () => {
      statuses[src] = 'loaded'
      resolve(true)
    }
    image.onerror = () => {
      statuses[src] = 'failed'
      console.warn(
        `[viewer assets]: failed to load image, keeping the fallback: ${src}`,
      )
      resolve(false)
    }
    image.src = src
  })
  return promises[src]
}

/** 測試用：清掉預載紀錄。 */
export const resetPreloadedImages = () => {
  Object.keys(statuses).forEach((src) => delete statuses[src])
  Object.keys(promises).forEach((src) => delete promises[src])
}
