import JSDC from "../";
import { LayerInfo } from "../Controller/LayerController";
import React from "react";
export declare type JSDCContextType = {
    Jsdc: JSDC;
    layerInfos: LayerInfo[];
};
declare const JSDCContext: React.Context<JSDCContextType>;
export interface IJSDCProviderProps {
    children: React.ReactNode;
    Jsdc: JSDC;
}
declare const JSDCProvider: React.FC<IJSDCProviderProps>;
export { JSDCContext, JSDCProvider };
