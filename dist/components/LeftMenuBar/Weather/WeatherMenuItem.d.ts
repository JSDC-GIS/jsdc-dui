/// <reference types="react" />
import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import { IWeatherDialogContentProps } from './WeatherDialogContent';
export interface IWeatherMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, IWeatherDialogContentProps {
}
declare const WeatherMenuItem: (props: IWeatherMenuItemProps) => JSX.Element;
export default WeatherMenuItem;
