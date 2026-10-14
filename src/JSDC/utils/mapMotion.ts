import { Map } from 'leaflet'

// 地圖是否在移動（movestart 到 moveend 之間，包含 flyTo 飛行、縮放動畫、拖曳）。
// Leaflet 沒有公開的查詢方法，只能從事件追蹤，所以要在移動開始前就掛上：
// JSDC 建好地圖、呼叫 flyToBounds 之前先呼叫 trackMapMotion。
const moving = new WeakMap<Map, boolean>()

export const trackMapMotion = (map: Map) => {
  if (moving.has(map)) return
  moving.set(map, false)
  map.on('movestart', () => moving.set(map, true))
  map.on('moveend', () => moving.set(map, false))
}

/** 沒有追蹤過的地圖一律當成靜止。 */
export const isMapMoving = (map: Map) => moving.get(map) === true

/**
 * 地圖靜止時立刻執行 callback；移動中就等這次移動的 moveend。
 * moveend 的 handler 依註冊順序執行，這裡註冊得比較晚，執行時其他圖層
 * （例如 markercluster）已經處理完這次的 zoomend／moveend。
 */
export const runWhenMapIdle = (map: Map, callback: () => void) => {
  if (!isMapMoving(map)) {
    callback()
    return
  }
  map.once('moveend', callback)
}
