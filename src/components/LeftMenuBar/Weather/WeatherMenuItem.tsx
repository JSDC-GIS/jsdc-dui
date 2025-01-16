import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import WeatherDialogContent, {
  IWeatherDialogContentProps,
} from './WeatherDialogContent'
import Weather from '../../Icons/Weather'

export interface IWeatherMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    IWeatherDialogContentProps {}

const WeatherMenuItem: React.FC<IWeatherMenuItemProps> = (
  props: IWeatherMenuItemProps,
) => {
  return (
    <MenuItemWithDialog {...props} title="氣象預測" Icon={Weather}>
      <WeatherDialogContent {...props} />
    </MenuItemWithDialog>
  )
}
WeatherMenuItem.displayName = 'WeatherMenuItem'
export default WeatherMenuItem
