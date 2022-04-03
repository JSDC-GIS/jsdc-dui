import JSDCLayer from "../Layer/JSDCLayer";
import ApiProvider from "./ApiProvider";
import BasemapProvider from "./BasemapProvider";
import ConfigProvider from "./ConfigProvider";
import Event from "../utils/Event";
export declare type DguidewalksOptions = {
    config: ConfigProvider;
    basemap: BasemapProvider;
};
export default class Dguidewalks {
    config: ConfigProvider;
    basemap: BasemapProvider;
    api: ApiProvider;
    gisDataLoadEvent: Event<any>;
    constructor(options: DguidewalksOptions);
    get eventId(): string;
    get baseApiUrl(): string;
    get configProvider(): ConfigProvider;
    get apiProvider(): ApiProvider;
    loadBasemap(): JSDCLayer<import("leaflet").Layer>[];
    loadGisData(): Promise<JSDCLayer<import("leaflet").Layer>[]>;
}
