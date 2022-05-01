import JSDCLayer from "../Layer/JSDCLayer";
import ApiProvider from "./ApiProvider";
import ConfigProvider from "./ConfigProvider";
import Event from "../utils/Event";
import ArticleProxyParser from "./proxyParser";
export declare type DguidewalksOptions = {
    config: ConfigProvider;
};
export default class Dguidewalks {
    config: ConfigProvider;
    api: ApiProvider;
    gisDataLoadEvent: Event<any>;
    articleProxyParser: ArticleProxyParser;
    constructor(options: DguidewalksOptions);
    get eventId(): string;
    get baseApiUrl(): string;
    get configProvider(): ConfigProvider;
    get apiProvider(): ApiProvider;
    loadGisData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
    getSceneArticles(): Promise<import("./proxyParser").DetailArticleInCompleteType[]>;
    getSceneDetailArticleByTitle(title: string): Promise<import("./proxyParser").DetailArticleType>;
}
