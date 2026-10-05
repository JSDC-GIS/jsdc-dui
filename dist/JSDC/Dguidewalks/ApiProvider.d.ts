import { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Point, Polygon } from 'geojson';
import ConfigProvider from './ConfigProvider';
interface LayerApiRespBase {
    updatedAt: string;
    createdAt: string;
    options: null | {};
    id: string;
    layerId: string;
}
export interface LayerApiRespVectorProps {
    name: string;
    type: string;
    url: null | string;
    [k: string]: any;
}
export interface LayerApiRespVectorType<T = {}> extends LayerApiRespBase, LayerApiRespVectorProps {
    geometry: T;
}
export type LayerApiRespLineFeature = LayerApiRespVectorType<LineString | MultiLineString>;
export type LayerApiRespPointFeature = LayerApiRespVectorType<Point>;
export type LayerApiRespPolygonFeature = LayerApiRespVectorType<Polygon | MultiPolygon>;
export interface LayerApiRespBasemap extends LayerApiRespBase {
    url: 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM50K_1916-jpg-{z}-{x}-{y}';
}
export interface BasemapApiRespItem {
    createdAt: string;
    id: number;
    name: string;
    options: null | {};
    type: 'xyz' | string;
    updatedAt: string;
    url: string;
}
export interface LayerApiRespItem {
    Basemap: null | LayerApiRespBasemap;
    LineFeatures: LayerApiRespLineFeature[];
    PointFeatures: LayerApiRespPointFeature[];
    PolygonFeatures: LayerApiRespPolygonFeature[];
    createdAt: string;
    eventId: string;
    id: string;
    name: string;
    options: null | {};
    type: 'line' | 'point' | 'polygon' | 'image';
    updatedAt: string;
}
export interface ApiGetLayerResponse {
}
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
export interface WalkMapLayer {
    name: string;
    url: string;
    attribution?: string;
    default?: boolean;
}
export interface WalkMapConfig {
    zoom: number;
    baseLayers: WalkMapLayer[];
    overlays: WalkMapLayer[];
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
    readonly baseUrl: string;
    readonly sceneApiUrl: string;
    readonly eventId: string;
    readonly cmsPath: string[];
    constructor(configProvider: ConfigProvider);
    get layersApiUrl(): string;
    get basemapsUrl(): string;
    get walkApiUrl(): string;
    get counterUrl(): string;
    getVisitorCount(): Promise<ApiGetVisitorCountResponse>;
    getLayers(): Promise<LayerApiRespItem[]>;
    getBasemaps(): Promise<BasemapApiRespItem[]>;
    getWalk(): Promise<WalkResponse>;
    get proxyApiUrl(): string;
    getProxyQuery: (targetUrl: string) => Promise<string>;
}
export {};
