import { Feature } from 'geojson'
import { GeoJSON, Layer } from 'leaflet'
import JSDCLayer from '../Layer/JSDCLayer'
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer'
import { WalkGeoJSONLayer } from './ApiProvider'
import {
  getGeometryKind,
  getStyleByMatch,
} from './createLayer/createGeoJSONLayer'

/** `mapConfig.overlays` 的一筆 `geojson` 疊圖和它建出來的圖層。 */
export type GeoJSONOverlayLayer = {
  overlay: WalkGeoJSONLayer
  layer: JSDCGeoJSONLayer
}

/** 「路線顏色」選單的一列。 */
export type PathColorItem = {
  /** 線段名稱原文（`properties[styleBy.prop]`，沒有 `styleBy` 時是 `properties.name`）。 */
  name: string
  /** 顯示用的名稱：語系是 en 且線段有 `properties.nameEn` 時是 `nameEn`，否則同 `name`。 */
  label: string
  color: string
}

/** 設定裡沒有指定顏色時，Leaflet 畫線用的預設色。 */
export const DEFAULT_PATH_COLOR = '#3388ff'

const getFeatures = (layer: JSDCGeoJSONLayer) =>
  (layer.instance?.getLayers() || [])
    .map((item) => (item as Layer & { feature?: Feature }).feature)
    .filter((feature): feature is Feature => !!feature)

/**
 * 由已載入的線圖層產生「路線顏色」清單，每個線段一列：
 * - 只列幾何是 LineString / MultiLineString 的 feature，面圖層不列（即使有 `styleBy`）。
 * - 名稱是 `properties[styleBy.prop]`，沒有 `styleBy` 時用 `properties.name`；沒有名稱的不列。
 * - 顏色是 `styleBy.styles[名稱].color`，對不上就用 `style.color`。
 * - 同名同色的合併成一列。
 */
export const getPathColorItems = (
  overlayLayers: GeoJSONOverlayLayer[],
  language?: string,
): PathColorItem[] => {
  const isEnglish = !!language && language.startsWith('en')
  const items: PathColorItem[] = []
  const seen: Record<string, true> = {}

  overlayLayers.forEach(({ overlay, layer }) => {
    const { style, styleBy } = overlay
    getFeatures(layer).forEach((feature) => {
      if (getGeometryKind(feature) !== 'line') return
      const properties = feature.properties || {}
      const rawName = properties[styleBy?.prop ?? 'name']
      if (rawName === undefined || rawName === null || rawName === '') return
      const name = String(rawName)
      const matched = getStyleByMatch(styleBy, properties)
      const color = matched?.color ?? style?.color ?? DEFAULT_PATH_COLOR
      const key = JSON.stringify([name, color])
      if (seen[key]) return
      seen[key] = true
      const nameEn = isEnglish && properties.nameEn
      items.push({ name, label: nameEn ? String(nameEn) : name, color })
    })
  })
  return items
}

export type LayerDefaultsOptions = {
  /** @deprecated 相容用：這些名稱的圖層額外顯示在地圖上。 */
  layersShowOnMapByDefault?: string[]
  /** @deprecated 相容用：這些名稱的圖層額外從圖層清單隱藏。 */
  layersHiddenFromUI?: string[]
}

/**
 * 圖層的預設狀態：以 `mapConfig`（已寫在 `description.visible` / `listed`）為準，
 * 下游還在傳的 `layersShowOnMapByDefault`、`layersHiddenFromUI` 只會「加上去」，
 * 不會把 `mapConfig` 設定要顯示的圖層關掉。
 */
export const resolveLayerDefaults = (
  description: JSDCLayer['description'],
  {
    layersShowOnMapByDefault = [],
    layersHiddenFromUI = [],
  }: LayerDefaultsOptions = {},
) => ({
  show:
    description.visible === true ||
    layersShowOnMapByDefault.includes(description.name),
  hidden:
    description.listed === false ||
    layersHiddenFromUI.includes(description.name),
})

/**
 * 維持線、面的疊放順序：面在下、線在上，同一種之間照 `mapConfig.overlays` 的陣列順序
 * （後面的在上）。Leaflet 的向量圖形是「後加到地圖的在上面」，使用者從圖層清單
 * 重新打開圖層就會跑到最上面，所以每次開關都重排一次。回傳解除監聽的函式。
 */
export const keepGeoJSONStackOrder = (layers: JSDCLayer[]) => {
  const geojsonLayers = layers.filter(
    (layer) => layer.instance instanceof GeoJSON,
  ) as JSDCLayer<GeoJSON>[]
  const ordered = [
    ...geojsonLayers.filter((layer) => layer.description.type === 'polygon'),
    ...geojsonLayers.filter((layer) => layer.description.type !== 'polygon'),
  ]
  const restack = () =>
    ordered.forEach((layer) => layer.show && layer.instance?.bringToFront())
  const removers = ordered.map((layer) =>
    layer.onToggleShowEvent.addEventListener(restack),
  )
  restack()
  return () => removers.forEach((remove) => remove())
}

/**
 * 圖層清單的顯示順序：`layerNameOrder` 列到的名稱照它的順序排在前面，沒列到的維持原順序
 * 排在後面。穩定排序、不以名稱當 key，所以同名的圖層都會保留（各自一列）。
 */
export const sortByLayerNameOrder = <
  T extends { description: { name: string } },
>(
  layerInfos: T[],
  layerNameOrder: string[] = [],
): T[] => {
  const rankOf = (item: T) => {
    const index = layerNameOrder.indexOf(item.description.name)
    return index < 0 ? layerNameOrder.length : index
  }
  return layerInfos
    .map((item, index) => ({ item, index, rank: rankOf(item) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ item }) => item)
}
