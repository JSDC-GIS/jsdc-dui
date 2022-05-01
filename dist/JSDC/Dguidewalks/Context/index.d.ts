import JSDC from "../../";
import React from "react";
import Dguidewalks from "..";
export declare type DguidewalksContextType = {
    dgw: Dguidewalks;
};
declare const DguidewalksContext: React.Context<DguidewalksContextType>;
export interface IDguidewalksProviderProps {
    Jsdc: JSDC;
    layersHiddenFromUI: Array<string>;
    layersShowOnMapByDefault: Array<string>;
    baseApiUrl?: string;
    cmsPath?: string;
}
declare const DguidewalksProvider: React.FC<IDguidewalksProviderProps>;
export { DguidewalksContext, DguidewalksProvider };
