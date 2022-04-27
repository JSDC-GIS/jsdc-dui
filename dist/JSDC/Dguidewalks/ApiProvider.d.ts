import { LineString, MultiLineString, MultiPolygon, Point, Polygon } from "geojson";
import ConfigProvider from "./ConfigProvider";
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
export declare type LayerApiRespLineFeature = LayerApiRespVectorType<LineString | MultiLineString>;
export declare type LayerApiRespPointFeature = LayerApiRespVectorType<Point>;
export declare type LayerApiRespPolygonFeature = LayerApiRespVectorType<Polygon | MultiPolygon>;
export interface LayerApiRespBasemap extends LayerApiRespBase {
    url: "https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM50K_1916-jpg-{z}-{x}-{y}";
}
export interface LayerApiRespItem {
    Basemaps: null | LayerApiRespBasemap;
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
export default class ApiProvider {
    readonly baseUrl: string;
    readonly eventId: string;
    constructor(configProvider: ConfigProvider);
    get layersApiUrl(): string;
    getLayers(): Promise<LayerApiRespItem[]>;
    get proxyApiUrl(): string;
    getProxyQuery(targetUrl: string): Promise<string>;
}
export {};
