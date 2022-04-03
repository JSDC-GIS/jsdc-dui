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
export declare type RuiContextType = {
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
export declare const initialRuiContext: RuiContextType;
declare const RuiContext: React.Context<RuiContextType>;
declare type MenuItemType = {
    id: string;
    name: string;
};
export interface IRuiContextProviderProps {
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
declare const RuiContextProvider: React.FC<IRuiContextProviderProps>;
export { RuiContextProvider, RuiContext };
