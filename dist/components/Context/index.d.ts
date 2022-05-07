import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent';
import React from 'react';
import { ILegendDialogContentProps } from '../LeftMenuBar/Legend/LegendDialogContent';
import { StyleType } from './Theme/useTheme';
import Event from '../../JSDC/utils/Event';
export declare const defaultMenuItems: {
    id: string;
    name: string;
}[];
export declare type WeatherConfig = {
    disabled?: boolean;
    token: string | undefined;
    locations: IWeatherDialogContentProps['locations'];
};
export declare type LegendConfig = {
    disabled?: boolean;
    activeLegends: ILegendDialogContentProps['activeLegends'];
};
export declare type DuiContextType = {
    sidebarTitle: string;
    sidebarSubtitle: string;
    aboutWalkImgSrc: string;
    aboutWalkContent: string;
    credit: string;
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
    onSceneTargetClick: (title: string) => void;
};
export declare const initialDuiContext: {};
declare const DuiContext: React.Context<DuiContextType>;
declare type MenuItemType = {
    id: string;
    name: string;
};
export interface IDuiContextProviderProps {
    sidebarTitle: string;
    sidebarSubtitle: string;
    aboutWalkImgSrc: string;
    aboutWalkContent: string;
    credit: string;
    headerMBImgSrc: string;
    headerDImgSrc: string;
    menuSwitchItems: Array<MenuItemType>;
    weatherConfig: WeatherConfig;
    legendConfig: LegendConfig;
    themeConfig?: StyleType;
    onSceneTargetClick?: (title: string) => void;
}
declare const DuiContextProvider: React.FC<IDuiContextProviderProps>;
export { DuiContextProvider, DuiContext };
