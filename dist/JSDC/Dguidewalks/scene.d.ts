import Leaflet, { Marker } from 'leaflet';
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer';
import { SceneCategory, SceneFeature, SceneProperties } from './ApiProvider';
/** 景點圖層固定的 id 與 name。景點圖層由 jsdc-dui 管理，下游不需要用名稱查找。 */
export declare const SCENE_LAYER_NAME = "scene";
/** 景點圖層裡的 marker；`feature` 是 Strapi 原樣的 Feature。 */
export type SceneMarker = Marker<SceneProperties> & {
    feature: SceneFeature;
};
export declare const getSceneIcon: (category?: SceneCategory | null) => Leaflet.Icon<Leaflet.IconOptions>;
export declare const getSceneMarkers: (sceneLayer?: JSDCGeoJSONLayer) => SceneMarker[];
/**
 * 把 Strapi 的 `pois.features` 原樣建成景點圖層（feature.id、properties 都不動）。
 * `geometry` 為 null 的景點沒有座標，無法放上地圖，直接略過。
 */
export declare const createSceneLayer: (features: SceneFeature[]) => JSDCGeoJSONLayer;
/**
 * 景點的座標。`geometry` 為 null 的景點（列表有、地圖上沒有）回傳 undefined，
 * 呼叫端據此略過定位與導航。
 */
export declare const getSceneLatLng: (feature: SceneFeature) => Leaflet.LatLng | undefined;
/**
 * 用 title 找景點 marker，比對規則見 `findByTitle`。
 * 只給下游用寫死的名稱找景點；jsdc-dui 內部一律用 id / feature（見 `findSceneById`）。
 */
export declare const findSceneByTitle: (markers: SceneMarker[], title: string) => SceneMarker | undefined;
/**
 * 用 id 找景點 marker。同時比對 Strapi documentId（feature.id）與
 * `legacyGisId`，讓舊的 GIS UUID 深連結繼續有效。
 */
export declare const findSceneById: (markers: SceneMarker[], id: string) => SceneMarker | undefined;
/**
 * 集章用的點名。4 個舊點的 GIS 原名與 Strapi title 不同（全形括號、空白、大小寫、錯字），
 * 後端把原名放在 `legacyName`；集章 key 沒有正規化，差一個字元就是另一個集章點，
 * 所以這裡一定要優先用它，已經集過的章才不會消失。顯示仍然用 `title`。
 */
export declare const getSceneCheckinName: (feature: SceneFeature) => string;
/** 集章 key：`btoa(encodeURI('{eventId}:{點名}'))`，與集章後台既有的格式一致。 */
export declare const getSceneCheckinKey: (eventId: string, feature: SceneFeature) => string;
/** 預設的集章 iframe 網址。 */
export declare const getSceneCheckinSrc: (eventId: string, feature: SceneFeature) => string;
/**
 * 分享用的深連結。新連結一律用 Strapi documentId（`feature.id`）；
 * 舊的 GIS UUID 連結靠 `findSceneById` 比對 `legacyGisId` 繼續有效。
 */
export declare const getSceneShareUrl: (feature: SceneFeature, location?: Pick<Location, 'origin' | 'pathname'>, paramKey?: string) => string;
export declare const DEFAULT_SCENE_VALID_DISTANCE = 100;
/** 網址帶 `#debug` 時是測試模式，不在現場也能集章。 */
export declare const isSceneDebugMode: (url: string) => boolean;
/** 集章的有效距離（公尺）：測試模式不限距離，否則用設定值。 */
export declare const getSceneValidDistance: (url: string, validDistance?: number) => number;
/**
 * 集章 iframe（集章清單、集章頁）會用 postMessage 傳 `'lng,lat'` 字串回來，要求導航到那個點。
 * window 上的 message 來源很雜（瀏覽器擴充、其他 iframe），格式不對的一律忽略，回傳 undefined。
 */
export declare const parseSceneNavigationMessage: (data: unknown) => {
    lat: number;
    lng: number;
} | undefined;
