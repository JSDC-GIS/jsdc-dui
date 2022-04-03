import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent';
import React from 'react';
import { ILegendDialogContentProps } from '../LeftMenuBar/Legend/LegendDialogContent';
import { StyleType } from './Theme/useTheme';
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
    credit: string;
    headerMBImgSrc: string;
    headerDImgSrc: string;
    activeMenuId: string | undefined;
    menuSwitcherAction: (id: string) => {
        onClick: () => void;
        onClose: () => void;
    };
    weatherConfig: WeatherConfig;
    legendConfig: LegendConfig;
};
export declare const initialDuiContext: DuiContextType;
declare const DuiContext: React.Context<DuiContextType>;
declare type MenuItemType = {
    id: string;
    name: string;
};
export interface IDuiContextProviderProps {
    sidebarTitle: string;
    sidebarSubtitle: string;
    credit: string;
    headerMBImgSrc: string;
    headerDImgSrc: string;
    menuSwitchItems: Array<MenuItemType>;
    weatherConfig: WeatherConfig;
    legendConfig: LegendConfig;
    themeConfig?: StyleType;
}
declare const DuiContextProvider: React.FC<IDuiContextProviderProps>;
export { DuiContextProvider, DuiContext };
