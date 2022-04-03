import JSDCLayer from "../../Layer/JSDCLayer";
import { LayerApiRespVectorType } from "../ApiProvider";
import { CommonProps } from "./types";
declare const createGeoJSONLayer: (options: LayerApiRespVectorType[], commonOptions: CommonProps) => JSDCLayer<import("leaflet").Layer>;
export default createGeoJSONLayer;
