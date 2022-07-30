import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import React from 'react';
import { IWeatherDialogContentProps } from './WeatherDialogContent';
export interface IWeatherMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, IWeatherDialogContentProps {
}
declare const WeatherMenuItem: React.FC<IWeatherMenuItemProps>;
export default WeatherMenuItem;
