import { LayerApiRespItem } from "../ApiProvider";
export declare type CommonProps = Omit<LayerApiRespItem, "Basemaps" | "LineFeatures" | "PointFeatures" | "PolygonFeatures">;
