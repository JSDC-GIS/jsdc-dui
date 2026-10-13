import JSDCLayer from '../Layer/JSDCLayer';
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer';
import ApiProvider, { SceneFeature, WalkResponse } from './ApiProvider';
import ConfigProvider from './ConfigProvider';
import { GeoJSONOverlayLayer } from './mapLayers';
import Event from '../utils/Event';
import { IArticleProxyParser } from './proxyParser/@types';
import { SceneMarker } from './scene';
export type { SceneCategory, SceneFeature, SceneProperties, WalkGeoJSONLayer, WalkGeoJSONStyleBy, WalkMapConfig, WalkMapLayer, WalkResponse, WalkTileLayer, WalkViewerAssets, } from './ApiProvider';
export { isWalkGeoJSONLayer, isWalkTileLayer } from './ApiProvider';
export type { GeoJSONOverlayLayer, PathColorItem } from './mapLayers';
export { VIEWER_MANIFEST_ATTRIBUTE, applyViewerHeadIcons, applyViewerManifest, buildViewerManifest, getLegendNamesFromCategories, pickViewerImageAssets, resolveViewerManifestIcons, resolveViewerHeadIcons, resolveViewerImages, } from './viewerAssets';
export type { ViewerHeadIcons, ViewerImageAssets, ViewerImageFallbacks, ViewerManifestIcon, ViewerImages, } from './viewerAssets';
export { SCENE_LAYER_NAME, DEFAULT_SCENE_VALID_DISTANCE, getSceneCheckinName, getSceneCheckinKey, getSceneCheckinSrc, getSceneLatLng, getSceneShareUrl, getSceneValidDistance, isSceneDebugMode, } from './scene';
export { default as StrapiArticleParser } from './proxyParser/StrapiArticleParser';
export type { SceneMarker } from './scene';
export type DguidewalksOptions = {
    config: ConfigProvider;
    layerNameOrder?: string[];
    /** 景點文章來源。不傳就用內建的 Strapi 來源（與景點圖層共用同一次 walk 請求）。 */
    articleParser?: IArticleProxyParser;
};
export default class Dguidewalks {
    config: ConfigProvider;
    api: ApiProvider;
    layerNameOrder: string[];
    /** 底圖、線、面、景點圖層都建好並加到地圖後發出。 */
    dataLoadEvent: Event<any>;
    articleProxyParser: IArticleProxyParser;
    /** 景點圖層（Strapi）。載入前、或景點 API 失敗時為 undefined。 */
    sceneLayer: JSDCGeoJSONLayer | undefined;
    /** `/walks/{eventId}` 的回應原樣。載入前、或景點 API 失敗時為 undefined。 */
    walk: WalkResponse | undefined;
    /** `mapConfig.overlays` 裡已載入的 `geojson` 疊圖（線、面），照陣列順序。 */
    geoJSONOverlayLayers: GeoJSONOverlayLayer[];
    private walkPromise;
    constructor(options: DguidewalksOptions);
    get eventId(): string;
    /** @deprecated 改用 `dataLoadEvent`（同一個事件物件）。 */
    get gisDataLoadEvent(): Event<any>;
    get configProvider(): ConfigProvider;
    get apiProvider(): ApiProvider;
    /**
     * 建立地圖要用的全部圖層，資料都來自同一次 `/walks/{eventId}`（外加各 GeoJSON 檔）：
     * `mapConfig.baseLayers` 的圖磚 → `mapConfig.overlays`（圖磚與線、面，照陣列順序）→ 景點圖層。
     * 圖層預設是否顯示、是否列在圖層清單寫在 `description.visible` / `description.listed`。
     * `mapConfig` 是內容端手動維護的 JSON：填錯的項目 `console.warn` 後略過，
     * 不會 reject，也不影響其他圖層與景點。
     */
    loadMapData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
    /** @deprecated 改用 `loadMapData()`。 */
    loadGisData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
    private loadMapConfigLayers;
    private getMapConfigItems;
    private isCompleteLayer;
    private pickDefaultBaseLayer;
    private createTileLayer;
    private loadGeoJSONLayers;
    /** 「路線顏色」選單的資料，由已載入的線圖層產生（規則見 `getPathColorItems`）。 */
    getPathColors(language?: string): import("./mapLayers").PathColorItem[];
    /**
     * 載入 walk，整個生命週期只打一次 `/walks/{eventId}`：
     * 底圖、線、面、景點圖層與景點文章都從這裡拿，誰先呼叫都共用同一個 promise。
     * 失敗時 promise 會 reject，錯誤在這裡統一記錄一次。
     */
    loadWalk(): Promise<WalkResponse>;
    private loadSceneLayer;
    findSceneByTitle(title: string): SceneMarker | undefined;
    findSceneById(id: string): SceneMarker | undefined;
    getSceneArticles(language?: string): Promise<import("./proxyParser/@types").SummaryArticleType[]>;
    /**
     * 由景點 feature 取內文。景點文字與點位是同一份資料，直接讀 feature，
     * 不用 title 繞回去比對（title 相同或互相包含的景點會配錯）。
     */
    getSceneDetailArticle(feature: SceneFeature, language?: string): Promise<import("./proxyParser/@types").DetailArticleType>;
}
