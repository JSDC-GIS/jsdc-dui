import JSDCLayer from "../Layer/JSDCLayer";
import ApiProvider from "./ApiProvider";
import ConfigProvider from "./ConfigProvider";
import Event from "../utils/Event";
import ArticleProxyParser from "./proxyParser";
export declare type DguidewalksOptions = {
    config: ConfigProvider;
    layerNameOrder?: string[];
};
export default class Dguidewalks {
    config: ConfigProvider;
    api: ApiProvider;
    layerNameOrder: string[];
    gisDataLoadEvent: Event<any>;
    articleProxyParser: ArticleProxyParser;
    constructor(options: DguidewalksOptions);
    get eventId(): string;
    get baseApiUrl(): string;
    get configProvider(): ConfigProvider;
    get apiProvider(): ApiProvider;
    loadGisData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
    getSceneArticles(): Promise<import("./proxyParser").DetailArticleInCompleteType[]>;
    getSceneDetailArticleByTitle(title: string, fallbackUrl?: string | null): Promise<import("./proxyParser").DetailArticleType>;
}
