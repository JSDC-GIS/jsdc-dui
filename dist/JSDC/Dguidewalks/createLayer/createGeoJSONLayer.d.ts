import { LayerApiRespVectorType } from "../ApiProvider";
import { CommonProps } from "./types";
import JSDCGeoJSONLayer from "../../Layer/JSDCGeoJSONLayer";
declare const createGeoJSONLayer: (options: LayerApiRespVectorType[], commonOptions: CommonProps) => JSDCGeoJSONLayer;
export default createGeoJSONLayer;
