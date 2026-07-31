import JSDC from '../../';
import React from 'react';
import Dguidewalks from '..';
import ConfigProvider from '../ConfigProvider';
import { IArticleProxyParser } from '../proxyParser/@types';
import useGeolocation from '../../../hooks/useGeolocation';
/**
 * 圖層顯示名的語系對照，key 為後端回傳的原始 `name`（同時是各種查找的 key，不做正規化）。
 * 查不到或該語系沒填時，一律 fallback 顯示原始 `name`。
 */
export type LayerNames = Record<string, {
    en?: string;
}>;
export type DguidewalksContextType = {
    dgw: Dguidewalks;
    geolocation: ReturnType<typeof useGeolocation>;
    layerLegendImages: Record<string, string>;
    layerNames: LayerNames;
};
declare const DguidewalksContext: React.Context<DguidewalksContextType>;
export interface IDguidewalksProviderProps {
    children?: React.ReactNode;
    Jsdc: JSDC;
    layersHiddenFromUI: Array<string>;
    layersShowOnMapByDefault: Array<string>;
    layerNameOrder?: Array<string>;
    articleParser: IArticleProxyParser;
    config: ConfigProvider;
    layerLegendImages?: Record<string, string>;
    layerNames?: LayerNames;
}
declare const DguidewalksProvider: React.FC<IDguidewalksProviderProps>;
export { DguidewalksContext, DguidewalksProvider };
