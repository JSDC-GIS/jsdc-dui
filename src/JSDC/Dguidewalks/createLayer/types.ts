import { LayerApiRespItem } from "../ApiProvider";

export type CommonProps = Omit<LayerApiRespItem, "Basemaps" | "LineFeatures" | "PointFeatures" | "PolygonFeatures">
