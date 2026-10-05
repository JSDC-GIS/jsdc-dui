import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent';
import React from 'react';
import { ILegendDialogContentProps } from '../LeftMenuBar/Legend/LegendDialogContent';
import { StyleType } from './Theme/useTheme';
import Event from '../../JSDC/utils/Event';
import { ISceneMenuItemProps } from '../LeftMenuBar/Scene/SceneMenuItem';
import { SceneConfig, SceneController } from '../../hooks/useSceneController';
import { SceneMarker } from '../../JSDC/Dguidewalks/scene';
import { SceneFeature } from '../../JSDC/Dguidewalks/ApiProvider';
export type { SceneConfig, SceneController };
export declare const defaultMenuItems: {
    id: string;
    name: string;
}[];
export type WeatherConfig = {
    disabled?: boolean;
    token: string | undefined;
    locations: IWeatherDialogContentProps['locations'];
};
export type LegendConfig = {
    disabled?: boolean;
    activeLegends: ILegendDialogContentProps['activeLegends'];
};
export type SettingConfig = {
    /** 隱藏整個「工具設定」選單項目 */
    disabled?: boolean;
    /** 保留「工具設定」，但隱藏其中的語言切換器 */
    languageSwitcherDisabled?: boolean;
};
export type DuiContextType = {
    sidebarTitle: string;
    sidebarSubtitle: string;
    aboutWalkImgSrc: string;
    aboutWalkContent: string;
    credit: string;
    creditHref?: string;
    headerMBImgSrc: string;
    headerDImgSrc: string;
    activeMenuId: string | undefined;
    menuSwitch: (id: string | undefined) => void;
    menuSwitcherAction: (id: string) => {
        onClick: () => void;
        onClose: () => void;
    };
    menuSwitchEvent: Event<string | undefined>;
    weatherConfig: WeatherConfig;
    legendConfig: LegendConfig;
    settingConfig: SettingConfig;
    onSceneTargetClick: (feature: SceneFeature) => void;
    onSceneNavigate: (feature: SceneFeature) => void;
    sceneCardsReducer: ISceneMenuItemProps['cardsReducer'];
    /** 景點內建行為的狀態，給 `SceneCheckin` 渲染用。 */
    scene: SceneController;
    /** 開啟指定景點的集章卡片（不經過 `sceneConfig.onSceneClick`）。 */
    openSceneCard: (marker: SceneMarker) => void;
    closeSceneCard: () => void;
};
export declare const initialDuiContext: {};
declare const DuiContext: React.Context<DuiContextType>;
type MenuItemType = {
    id: string;
    name: string;
};
export interface IDuiContextProviderProps {
    children?: React.ReactNode;
    sidebarTitle: string;
    sidebarSubtitle: string;
    aboutWalkImgSrc: string;
    aboutWalkContent: string;
    credit: string;
    creditHref?: string;
    headerMBImgSrc: string;
    headerDImgSrc: string;
    menuSwitchItems: Array<MenuItemType>;
    weatherConfig: WeatherConfig;
    legendConfig: LegendConfig;
    settingConfig?: SettingConfig;
    themeConfig?: StyleType;
    /**
     * 景點列表的定位鈕。預設飛到該景點（縮放層級見 `sceneConfig.targetZoom`）。
     * 參數是 Strapi 原樣的景點 feature（`feature.id`、`properties`、`geometry`），
     * 只會收到有座標的景點；需要 marker 時用 `dgw.findSceneById(feature.id)`。
     */
    onSceneTargetClick?: (feature: SceneFeature) => void;
    /** 景點列表、集章卡片的導航鈕。預設用 Google 步行導航到該景點。參數同上。 */
    onSceneNavigate?: (feature: SceneFeature) => void;
    sceneCardsReducer?: ISceneMenuItemProps['cardsReducer'];
    /** 景點圖層的內建行為（點擊開卡片、cluster、集章、深連結）。不傳就是全部預設。 */
    sceneConfig?: SceneConfig;
}
declare const DuiContextProvider: React.FC<IDuiContextProviderProps>;
export { DuiContextProvider, DuiContext };
