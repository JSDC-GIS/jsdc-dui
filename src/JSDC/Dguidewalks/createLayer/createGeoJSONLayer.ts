import { Feature, GeoJsonObject } from 'geojson'
import { Layer, PathOptions } from 'leaflet'
import { uniqueId } from 'lodash'
import { WalkGeoJSONLayer } from '../ApiProvider'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'

export type GeometryKind = 'point' | 'line' | 'polygon'

/** 點／線／面一律看 feature 的 `geometry.type`，不看圖層名稱。 */
export const getGeometryKind = (
  feature?: Pick<Feature, 'geometry'>,
): GeometryKind | undefined => {
  switch (feature?.geometry?.type) {
    case 'Point':
    case 'MultiPoint':
      return 'point'
    case 'LineString':
    case 'MultiLineString':
      return 'line'
    case 'Polygon':
    case 'MultiPolygon':
      return 'polygon'
    default:
      return undefined
  }
}

/**
 * `styleBy` 對到的樣式：`String(properties[prop])` 與 `styles` 的 key 全等時回傳該樣式。
 * 屬性不存在或是 null 時不比對（否則會變成字串 `'undefined'` / `'null'` 去對 key）。
 */
export const getStyleByMatch = (
  styleBy: WalkGeoJSONLayer['styleBy'],
  properties: Feature['properties'] | undefined,
): PathOptions | undefined => {
  if (!styleBy?.styles) return undefined
  const value = properties?.[styleBy.prop]
  if (value === undefined || value === null) return undefined
  const key = String(value)
  return Object.prototype.hasOwnProperty.call(styleBy.styles, key)
    ? styleBy.styles[key]
    : undefined
}

/** 先套 `style`，`styleBy` 對得上時（規則見 `getStyleByMatch`）再以該樣式覆寫。 */
export const getFeatureStyle = (
  overlay: Pick<WalkGeoJSONLayer, 'style' | 'styleBy'>,
  feature?: Pick<Feature, 'properties'>,
): PathOptions => ({
  ...overlay.style,
  ...getStyleByMatch(overlay.styleBy, feature?.properties),
})

/** `popupProp` 指到的屬性有值時回傳要顯示的文字，否則 undefined（不綁 popup）。 */
export const getFeaturePopupText = (
  overlay: Pick<WalkGeoJSONLayer, 'popupProp'>,
  feature?: Pick<Feature, 'properties'>,
) => {
  if (!overlay.popupProp) return undefined
  const value = feature?.properties?.[overlay.popupProp]
  if (value === undefined || value === null || value === '') return undefined
  return String(value)
}

const getLayerKind = (layer: JSDCGeoJSONLayer): GeometryKind => {
  const kinds = (layer.instance?.getLayers() || []).map((item) =>
    getGeometryKind((item as Layer & { feature?: Feature }).feature),
  )
  if (kinds.includes('line')) return 'line'
  if (kinds.includes('polygon')) return 'polygon'
  return kinds.includes('point') ? 'point' : 'line'
}

/**
 * 把 `mapConfig.overlays` 的一筆 `geojson` 疊圖和它的檔案內容建成圖層。
 * feature 原樣交給 Leaflet（`properties` 保留檔案原文），樣式與 popup 依設定套用。
 * `description.type` 是 `line` / `polygon` / `point`，由 feature 的幾何型別決定。
 */
const createGeoJSONLayer = (
  overlay: WalkGeoJSONLayer,
  geojson: GeoJsonObject,
) => {
  const layer = new JSDCGeoJSONLayer(
    {
      id: `${overlay.name}_${uniqueId('geojson')}`,
      description: {
        name: overlay.name,
        type: 'line',
        visible: overlay.visible === true,
        listed: overlay.listed !== false,
      },
    },
    {
      style: (feature) => getFeatureStyle(overlay, feature),
      onEachFeature: (feature, featureLayer) => {
        const text = getFeaturePopupText(overlay, feature)
        if (text === undefined) return
        // 屬性值當純文字顯示，不當 HTML 解析
        const content = document.createElement('span')
        content.textContent = text
        featureLayer.bindPopup(content)
      },
    },
  )
  layer.addFeature(geojson)
  layer.description.type = getLayerKind(layer)
  return layer
}

export default createGeoJSONLayer
