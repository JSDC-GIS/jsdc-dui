import JSDC from '../../';
import React from 'react';
import Dguidewalks from '..';
import ConfigProvider from '../ConfigProvider';
import { IArticleProxyParser } from '../proxyParser/@types';
import useGeolocation from '../../../hooks/useGeolocation';
export type DguidewalksContextType = {
    dgw: Dguidewalks;
    geolocation: ReturnType<typeof useGeolocation>;
    layerLegendImages: Record<string, string>;
};
declare const DguidewalksContext: React.Context<DguidewalksContextType>;
export interface IDguidewalksProviderProps {
    children: React.ReactNode;
    Jsdc: JSDC;
    layersHiddenFromUI: Array<string>;
    layersShowOnMapByDefault: Array<string>;
    layerNameOrder?: Array<string>;
    articleParser: IArticleProxyParser;
    config: ConfigProvider;
    layerLegendImages?: Record<string, string>;
}
declare const DguidewalksProvider: React.FC<IDguidewalksProviderProps>;
export { DguidewalksContext, DguidewalksProvider };
