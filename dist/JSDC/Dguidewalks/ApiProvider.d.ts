import { LineString, MultiLineString, MultiPolygon, Point, Polygon } from 'geojson';
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
export interface ApiGetVisitorCountResponse {
    project: string;
    counter: number;
}
export default class ApiProvider {
    readonly baseUrl: string;
    readonly eventId: string;
    readonly cmsPath: string[];
    constructor(configProvider: ConfigProvider);
    get layersApiUrl(): string;
    get basemapsUrl(): string;
    get counterUrl(): string;
    getVisitorCount(): Promise<ApiGetVisitorCountResponse>;
    getLayers(): Promise<LayerApiRespItem[]>;
    getBasemaps(): Promise<BasemapApiRespItem[]>;
    get proxyApiUrl(): string;
    getProxyQuery: (targetUrl: string) => Promise<string>;
}
export {};
