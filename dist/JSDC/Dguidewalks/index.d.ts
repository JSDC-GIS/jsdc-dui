import JSDCLayer from '../Layer/JSDCLayer';
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer';
import ApiProvider, { SceneFeature, WalkResponse } from './ApiProvider';
import ConfigProvider from './ConfigProvider';
import Event from '../utils/Event';
import { IArticleProxyParser } from './proxyParser/@types';
import { SceneMarker } from './scene';
export type { SceneCategory, SceneFeature, SceneProperties, WalkResponse, } from './ApiProvider';
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
    gisDataLoadEvent: Event<any>;
    articleProxyParser: IArticleProxyParser;
    /** 景點圖層（Strapi）。載入前、或景點 API 失敗時為 undefined。 */
    sceneLayer: JSDCGeoJSONLayer | undefined;
    /** `/walks/{eventId}` 的回應原樣。載入前、或景點 API 失敗時為 undefined。 */
    walk: WalkResponse | undefined;
    private walkPromise;
    constructor(options: DguidewalksOptions);
    get eventId(): string;
    get baseApiUrl(): string;
    get configProvider(): ConfigProvider;
    get apiProvider(): ApiProvider;
    loadGisData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
    /**
     * 載入 walk，整個生命週期只打一次 `/walks/{eventId}`：
     * 景點圖層與景點文章都從這裡拿，誰先呼叫都共用同一個 promise。
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
