import { DetailArticleType, IArticleProxyParser, SummaryArticleType } from './@types';
import { SceneFeature, WalkResponse } from '../ApiProvider';
export type StrapiArticleParserOptions = {
    /**
     * 取得 walk 回應。由 `Dguidewalks` 傳入它自己那一次（已快取的）請求，
     * 景點文字與地圖點位才會共用同一份資料，不會多打一次 `/walks/{code}`。
     */
    loadWalk: () => Promise<WalkResponse>;
};
/**
 * 景點文章來源（Strapi）：直接讀 `/walks/{code}` 回應裡每個景點的 properties。
 *
 * 中英文都在同一份回應裡，所以沒有快取、換語言也不必重抓。
 * 景點一律用 feature 識別（列表每筆都帶 `id` 與 `feature`），沒有 title 反查。
 */
declare class StrapiArticleParser implements IArticleProxyParser {
    private loadWalk;
    language: string;
    constructor(options: StrapiArticleParserOptions);
    get isEnglish(): boolean;
    setLanguage(language?: string): void;
    private getFeatures;
    private pickContent;
    getSummaryByFeature(feature: SceneFeature): SummaryArticleType;
    getDetailByFeature(feature: SceneFeature): DetailArticleType;
    /** 順序就是 API 回傳的順序（後端已排好），不再依 title 前綴重排。 */
    getAll(_refresh?: boolean, language?: string): Promise<SummaryArticleType[]>;
}
export default StrapiArticleParser;
