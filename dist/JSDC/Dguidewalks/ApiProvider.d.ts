import { Feature, FeatureCollection, GeoJsonObject, Point } from 'geojson';
import type { PathOptions } from 'leaflet';
import ConfigProvider from './ConfigProvider';
export interface SceneCategory {
    code: number;
    slug: string;
    name: string;
    color: string;
    /** 兩位數字串（'01'～'12'），對應 `map_icons/type{N}.svg` 的 N。 */
    icon: string;
    iconUrl: string;
}
export interface SceneTheme {
    documentId: string;
    name: string;
}
export interface SceneGalleryItem {
    url: string;
    thumb: string | null;
    caption: string | null;
}
export interface SceneAudioTrack {
    url: string;
    author: string | null;
    text: string | null;
}
/** 依語言分軌，沒有該語言時為 null。 */
export interface SceneAudio {
    zh: SceneAudioTrack | null;
    en: SceneAudioTrack | null;
    tw: SceneAudioTrack | null;
}
/** 語音配音者／英文內文作者，不是撰稿者（撰稿者是 `contributors`）。 */
export interface SceneAuthors {
    zh: string | null;
    en: string | null;
    tw: string | null;
}
export interface SceneSpeech {
    en: string | null;
    tw: string | null;
}
export interface SceneLink {
    label: string;
    url: string;
}
export interface SceneProperties {
    title: string;
    /** 從 title 開頭解析出的編號，例如 '01-1'。 */
    seq: string;
    category: SceneCategory | null;
    region: string;
    theme: SceneTheme | null;
    /** 原 GIS 點位 UUID，舊的 `?id=` 深連結比對用；Strapi 新增的景點為 null。 */
    legacyGisId: string | null;
    /** 原 GIS 點名原文，僅供集章 key 相容（`legacyName ?? title`），不用於顯示。 */
    legacyName: string | null;
    summary: string | null;
    summaryEn: string | null;
    body: string | null;
    coverImage: string | null;
    coverThumb: string | null;
    gallery: SceneGalleryItem[];
    video: string | null;
    audio: SceneAudio;
    speech: SceneSpeech;
    authors: SceneAuthors;
    contributors: string | null;
    links: SceneLink[];
    address: string | null;
    price: string | null;
    openingHours: string | null;
    mapZoom: number | null;
    pageUrl: string;
    embedUrl: string;
    updatedAt: string;
}
/** Strapi 原樣的景點 Feature；`id` 是 Strapi documentId，無座標時 `geometry` 為 null。 */
export interface SceneFeature extends Feature<Point | null, SceneProperties> {
    id: string;
}
/** 圖磚（底圖、疊圖）。`name` 是圖層的 key，也是圖層清單顯示的名稱。 */
export interface WalkTileLayer {
    name: string;
    url: string;
    attribution?: string;
    /** 只在 `baseLayers` 有意義：一進地圖就顯示的底圖。 */
    default?: boolean;
    /** 語系是 en 時圖層清單顯示的名稱。 */
    nameEn?: string;
}
/** 依 feature 屬性逐筆覆寫樣式：`String(properties[prop])` 與 `styles` 的 key 全等時套用。 */
export interface WalkGeoJSONStyleBy {
    prop: string;
    styles: Record<string, PathOptions>;
}
/** 線、面：`mapConfig.overlays` 裡 `type: 'geojson'` 的疊圖。 */
export interface WalkGeoJSONLayer {
    name: string;
    type: 'geojson';
    /** GeoJSON 檔的網址。相對路徑以 `sceneApiUrl` 的 origin 補齊。 */
    url: string;
    /** 整個圖層的樣式（Leaflet Path options）。 */
    style?: PathOptions;
    styleBy?: WalkGeoJSONStyleBy;
    /** 點擊圖形時顯示的屬性名稱，照原文取（m0009 是大寫的 `NAME`）。 */
    popupProp?: string;
    /** 預設是否顯示在地圖上。未提供時視為 false。 */
    visible?: boolean;
    /** 是否列在圖層清單。未提供時視為 true。 */
    listed?: boolean;
}
export type WalkMapLayer = WalkTileLayer | WalkGeoJSONLayer;
export declare const isWalkGeoJSONLayer: (layer: WalkMapLayer) => layer is WalkGeoJSONLayer;
export declare const isWalkTileLayer: (layer: WalkMapLayer) => layer is WalkTileLayer;
export interface WalkMapConfig {
    zoom: number;
    baseLayers: WalkTileLayer[];
    /** 圖磚與 `geojson` 疊圖混在同一個陣列，用 `isWalkGeoJSONLayer` 區分。 */
    overlays: WalkMapLayer[];
}
/**
 * 圖台的 6 張圖片，值是絕對網址；還沒有那張圖時是 null。
 * 後端尚未實作前整個欄位不存在，一律當成「沒有」，改用下游專案自己的圖。
 */
export interface WalkViewerAssets {
    /** 桌機版左側選單最上方的主視覺。 */
    headerDesktop: string | null;
    /** 手機版橫幅；集章對話框上方的圖。 */
    headerMobile: string | null;
    /** 「路線介紹」對話框裡的圖。 */
    about: string | null;
    /** 瀏覽器分頁圖示。 */
    logo: string | null;
    /** iOS 主畫面圖示。 */
    appleTouchIcon: string | null;
    favicon: string | null;
}
/** 代碼對應多個主題時才有內容，說明合併後的景點分屬哪些主題。 */
export interface WalkTheme {
    documentId: string;
    name: string;
    slug: string | null;
    region: string;
    regionLabel: string;
    pageUrl: string;
    poiCount: number;
}
export interface WalkResponse {
    code: string;
    slug: string | null;
    /** 代碼對應多個主題時為 null。 */
    documentId: string | null;
    name: string;
    region: string;
    regionLabel: string;
    intro: string | null;
    coverImage: string | null;
    brochureUrl: string | null;
    pageUrl: string | null;
    viewerUrl: string;
    updatedAt: string | null;
    categories: SceneCategory[];
    mapConfig: WalkMapConfig;
    viewerAssets?: WalkViewerAssets | null;
    bbox: number[];
    poiCount: number;
    themes?: WalkTheme[];
    pois: FeatureCollection<Point | null, SceneProperties> & {
        features: SceneFeature[];
    };
}
export interface ApiGetVisitorCountResponse {
    project: string;
    counter: number;
}
export default class ApiProvider {
    readonly sceneApiUrl: string;
    readonly eventId: string;
    readonly cmsPath: string[];
    constructor(configProvider: ConfigProvider);
    get walkApiUrl(): string;
    get counterUrl(): string;
    getVisitorCount(): Promise<ApiGetVisitorCountResponse>;
    getWalk(): Promise<WalkResponse>;
    /**
     * `mapConfig` 裡的 GeoJSON 檔網址是相對路徑（`/dguidedwalks.tw/map-data/...`），
     * 以 `sceneApiUrl` 的 origin 補齊；絕對網址原樣使用。
     * `sceneApiUrl` 本身是相對路徑（例如 `/api/map/`）時，先對目前頁面的網址解析。
     */
    resolveMapDataUrl(url: string): string;
    getGeoJSON(url: string): Promise<GeoJsonObject>;
}
