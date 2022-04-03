import { LayerApiRespItem } from "../ApiProvider";
export declare type CommonProps = Omit<LayerApiRespItem, "Basemap" | "LineFeatures" | "PointFeatures" | "PolygonFeatures">;
