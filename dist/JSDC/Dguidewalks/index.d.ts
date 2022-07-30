import JSDCLayer from "../Layer/JSDCLayer";
import ApiProvider from "./ApiProvider";
import ConfigProvider from "./ConfigProvider";
import Event from "../utils/Event";
import { IArticleProxyParser } from "./proxyParser/@types";
export declare type DguidewalksOptions = {
    config: ConfigProvider;
    layerNameOrder?: string[];
    articleParser: IArticleProxyParser;
};
export default class Dguidewalks {
    config: ConfigProvider;
    api: ApiProvider;
    layerNameOrder: string[];
    gisDataLoadEvent: Event<any>;
    articleProxyParser: IArticleProxyParser;
    constructor(options: DguidewalksOptions);
    get eventId(): string;
    get baseApiUrl(): string;
    get configProvider(): ConfigProvider;
    get apiProvider(): ApiProvider;
    loadGisData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
    getSceneArticles(): Promise<import("./proxyParser/@types").SummaryArticleType[]>;
    getSceneDetailArticleByTitle(title: string, fallbackUrl?: string | null): Promise<import("./proxyParser/@types").DetailArticleType>;
}
