import JSDC from '../../';
import React from 'react';
import Dguidewalks from '..';
import ConfigProvider from '../ConfigProvider';
import { IArticleProxyParser } from '../proxyParser/@types';
import useGeolocation from '../../../hooks/useGeolocation';
/**
 * 圖層顯示名的語系對照，key 為後端回傳的原始 `name`（同時是各種查找的 key，不做正規化）。
 * 查不到或該語系沒填時，一律 fallback 顯示原始 `name`。
 * @deprecated 英文名稱改讀 `mapConfig` 圖磚的 `nameEn`；這份對照只在圖磚沒有 `nameEn` 時才會用到。
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
    /**
     * @deprecated 是否列在圖層清單改由 `mapConfig` 的 `listed` 決定，不需要再傳。
     * 有傳的話，這些名稱的圖層會「額外」從圖層清單隱藏。
     */
    layersHiddenFromUI?: Array<string>;
    /**
     * @deprecated 預設是否顯示改由 `mapConfig` 的 `default`（底圖）、`visible`（線、面）決定，不需要再傳。
     * 有傳的話，這些名稱的圖層會「額外」顯示在地圖上。
     */
    layersShowOnMapByDefault?: Array<string>;
    layerNameOrder?: Array<string>;
    /** 不傳就用內建的 Strapi 景點文章來源。舊的 Drupal parser 仍可傳入。 */
    articleParser?: IArticleProxyParser;
    config: ConfigProvider;
    layerLegendImages?: Record<string, string>;
    /** @deprecated 英文名稱改讀 `mapConfig` 圖磚的 `nameEn`，`nameEn` 優先，沒有才看這裡。 */
    layerNames?: LayerNames;
}
declare const DguidewalksProvider: React.FC<IDguidewalksProviderProps>;
export { DguidewalksContext, DguidewalksProvider };
