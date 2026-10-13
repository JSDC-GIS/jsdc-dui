import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent';
import React from 'react';
import { LegendName } from '../../icon';
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
    /** 隱藏整個「圖例說明」選單項目 */
    disabled?: boolean;
    /**
     * 要亮起來（彩色）的類別名稱。不傳就跟著 Strapi：用 `/walks` 回應的 `categories[].name`，
     * 也就是這條路線實際用到的類別。有傳就照傳入的清單（給想自訂的專案覆寫）。
     */
    activeLegends?: LegendName[];
};
/** context 裡算好的圖例設定：`activeLegends` 一定是陣列。 */
export type ResolvedLegendConfig = LegendConfig & {
    activeLegends: LegendName[];
};
export type SettingConfig = {
    /** 隱藏整個「工具設定」選單項目 */
    disabled?: boolean;
    /** 保留「工具設定」，但隱藏其中的語言切換器 */
    languageSwitcherDisabled?: boolean;
};
export type PathColorConfig = {
    /**
     * 顯示「路線顏色」選單項目。預設不顯示，要顯示的專案明確設成 `true`
     * （方向和 `settingConfig.disabled` 相反）。
     * 內容由 `mapConfig` 已載入的線圖層自動產生；沒有任何可列的線段時，開啟了也不會出現。
     */
    enabled?: boolean;
};
export type DuiContextType = {
    sidebarTitle: string;
    sidebarSubtitle: string;
    /**
     * 「路線介紹」的圖、手機版橫幅、桌機版主視覺：已經算好的值——Strapi `viewerAssets`
     * 對應欄位有值就是它，否則是下游傳的 prop；兩者都沒有時是空字串（不要渲染圖）。
     */
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
    /** `activeLegends` 是算好的值：下游有傳用下游的，否則是 Strapi 的 `categories`。 */
    legendConfig: ResolvedLegendConfig;
    /**
     * 圖例要亮哪些類別是否已經確定。下游沒傳 `activeLegends` 時要等 `/walks` 回來，
     * 在那之前是 false（圖例先不畫，避免閃一下全灰）。
     */
    legendReady: boolean;
    settingConfig: SettingConfig;
    pathColorConfig: PathColorConfig;
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
    /**
     * 「路線介紹」對話框裡的圖。選填：Strapi 的 `viewerAssets.about` 有值時用 Strapi 的，
     * 這裡傳的是沒有值時（含 `/walks` 回來之前）的 fallback。
     */
    aboutWalkImgSrc?: string;
    aboutWalkContent: string;
    credit: string;
    creditHref?: string;
    /**
     * 手機版橫幅的 fallback（Strapi：`viewerAssets.headerMobile`）。
     * `sceneConfig.checkinKanbanImgSrc` 沒傳時，集章對話框上方也用這張算好的橫幅。
     */
    headerMBImgSrc?: string;
    /** 桌機版左側選單主視覺的 fallback（Strapi：`viewerAssets.headerDesktop`）。 */
    headerDImgSrc?: string;
    /** 下游自己加的選單項目 id（搭配 `mainMenuChildren` / `endMenuChildren`）；沒有自訂選單就不用傳 */
    menuSwitchItems?: Array<MenuItemType>;
    weatherConfig: WeatherConfig;
    /** 不傳就是預設：顯示「圖例說明」，亮起來的類別跟著 Strapi 的 `categories`。 */
    legendConfig?: LegendConfig;
    settingConfig?: SettingConfig;
    /** 內建的「路線顏色」選單。不傳就是不顯示；`{ enabled: true }` 開啟。 */
    pathColorConfig?: PathColorConfig;
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
