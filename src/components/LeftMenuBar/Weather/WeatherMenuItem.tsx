import MenuItemWithDialog, { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import WeatherDialogContent, { IWeatherDialogContentProps } from './WeatherDialogContent'

export interface IWeatherMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'startIconSrc' | 'startIconSrcActive' | 'children'>, IWeatherDialogContentProps {

}

const WeatherMenuItem = (props: IWeatherMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title='氣象預測' startIconSrc={icon.activable.weather} startIconSrcActive={icon.activable.weatherActive}>
      <WeatherDialogContent {...props}/>
    </MenuItemWithDialog>
  )
}

export default WeatherMenuItem
