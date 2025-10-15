import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import WeatherDialogContent, {
  IWeatherDialogContentProps,
} from './WeatherDialogContent'
import Weather from '../../Icons/Weather'
import { useTranslation } from 'react-i18next'

export interface IWeatherMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    IWeatherDialogContentProps {}

const WeatherMenuItem: React.FC<IWeatherMenuItemProps> = (
  props: IWeatherMenuItemProps,
) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.weatherForecast')} Icon={Weather}>
      <WeatherDialogContent {...props} />
    </MenuItemWithDialog>
  )
}
WeatherMenuItem.displayName = 'WeatherMenuItem'
export default WeatherMenuItem
