import { Feature, GeoJsonObject } from 'geojson';
import { PathOptions } from 'leaflet';
import { WalkGeoJSONLayer } from '../ApiProvider';
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer';
export type GeometryKind = 'point' | 'line' | 'polygon';
/** 點／線／面一律看 feature 的 `geometry.type`，不看圖層名稱。 */
export declare const getGeometryKind: (feature?: Pick<Feature, 'geometry'>) => GeometryKind | undefined;
/**
 * `styleBy` 對到的樣式：`String(properties[prop])` 與 `styles` 的 key 全等時回傳該樣式。
 * 屬性不存在或是 null 時不比對（否則會變成字串 `'undefined'` / `'null'` 去對 key）。
 */
export declare const getStyleByMatch: (styleBy: WalkGeoJSONLayer['styleBy'], properties: Feature['properties'] | undefined) => PathOptions | undefined;
/** 先套 `style`，`styleBy` 對得上時（規則見 `getStyleByMatch`）再以該樣式覆寫。 */
export declare const getFeatureStyle: (overlay: Pick<WalkGeoJSONLayer, 'style' | 'styleBy'>, feature?: Pick<Feature, 'properties'>) => PathOptions;
/** `popupProp` 指到的屬性有值時回傳要顯示的文字，否則 undefined（不綁 popup）。 */
export declare const getFeaturePopupText: (overlay: Pick<WalkGeoJSONLayer, 'popupProp'>, feature?: Pick<Feature, 'properties'>) => string | undefined;
/**
 * 把 `mapConfig.overlays` 的一筆 `geojson` 疊圖和它的檔案內容建成圖層。
 * feature 原樣交給 Leaflet（`properties` 保留檔案原文），樣式與 popup 依設定套用。
 * `description.type` 是 `line` / `polygon` / `point`，由 feature 的幾何型別決定。
 */
declare const createGeoJSONLayer: (overlay: WalkGeoJSONLayer, geojson: GeoJsonObject) => JSDCGeoJSONLayer;
export default createGeoJSONLayer;
