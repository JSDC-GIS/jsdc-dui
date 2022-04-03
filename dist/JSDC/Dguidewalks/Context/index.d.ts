import JSDC from "../../";
import React from "react";
import Dguidewalks from "..";
import { BasemapName } from "../BasemapProvider";
export declare type DguidewalksContextType = {
    dgw: Dguidewalks;
};
declare const DguidewalksContext: React.Context<DguidewalksContextType>;
export interface IDguidewalksProviderProps {
    Jsdc: JSDC;
    activeBasemaps: Array<BasemapName>;
    layersHiddenFromUI: Array<string>;
    layersShowOnMapByDefault: Array<string>;
}
declare const DguidewalksProvider: React.FC<IDguidewalksProviderProps>;
export { DguidewalksContext, DguidewalksProvider };
