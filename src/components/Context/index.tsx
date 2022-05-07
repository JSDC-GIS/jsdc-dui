import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent'
import React, { createContext, useRef, useState } from 'react'
import useSwitch from '../../utils/useSwitch'
import { ILegendDialogContentProps } from '../LeftMenuBar/Legend/LegendDialogContent'
import useTheme, { defaultStyle, StyleType } from './Theme/useTheme'
import Event from '../../JSDC/utils/Event'

// make sure they match menuItem components's props
// these items should be same as DguidewalksApp component content
export const defaultMenuItems = [
  {
    id: '地圖圖層',
    name: '地圖圖層'
  },
  {
    id: '景點介紹',
    name: '景點介紹'
  },
  {
    id: '氣象預測',
    name: '氣象預測'
  },
  {
    id: '圖例說明',
    name: '圖例說明'
  },
  {
    id: '路線介紹',
    name: '路線介紹'
  },
  {
    id: '關於圖台',
    name: '關於圖台'
  }
]

export type WeatherConfig = {
  disabled?: boolean
  token: string | undefined
  locations: IWeatherDialogContentProps['locations']
}

export type LegendConfig = {
  disabled?: boolean
  activeLegends: ILegendDialogContentProps['activeLegends']
}

export type DuiContextType = {
  sidebarTitle: string
  sidebarSubtitle: string
  aboutWalkImgSrc: string
  aboutWalkContent: string
  credit: string
  headerMBImgSrc: string
  headerDImgSrc: string
  activeMenuId: string | undefined
  menuSwitch: (id: string | undefined) => void
  menuSwitcherAction: (id: string) => {
    onClick: () => void
    onClose: () => void
  },
  menuSwitchEvent: Event<string | undefined>
  weatherConfig: WeatherConfig
  legendConfig: LegendConfig
  onSceneTargetClick: (title: string) => void
}

export const initialDuiContext = {}

const DuiContext = createContext<DuiContextType>(initialDuiContext as DuiContextType)

type MenuItemType = {
  id: string,
  name: string
}

export interface IDuiContextProviderProps {
  sidebarTitle: string
  sidebarSubtitle: string
  aboutWalkImgSrc: string
  aboutWalkContent: string
  credit: string
  headerMBImgSrc: string
  headerDImgSrc: string
  menuSwitchItems: Array<MenuItemType>,
  weatherConfig: WeatherConfig
  legendConfig: LegendConfig
  themeConfig?: StyleType
  onSceneTargetClick?: (title: string) => void
}

const DuiContextProvider: React.FC<IDuiContextProviderProps> = ({
  sidebarTitle,
  sidebarSubtitle,
  aboutWalkImgSrc,
  aboutWalkContent,
  credit,
  headerMBImgSrc,
  headerDImgSrc,
  children,
  weatherConfig,
  legendConfig,
  menuSwitchItems,
  themeConfig = defaultStyle,
  onSceneTargetClick = () => null
}) => {
  useTheme(themeConfig)
  const { switchById, activeId } = useSwitch<MenuItemType>([...defaultMenuItems, ...menuSwitchItems])
  const [menuSwitchEvent] = useState(new Event<string | undefined>())

  const menuSwitch = (id: string | undefined) => {
    switchById(id)
    menuSwitchEvent.raise(id)
  } 
  const menuSwitcherAction = (id: string) => {
    return {
      onClick: () => menuSwitch(id),
      onClose: () => {
        switchById(undefined)
        menuSwitchEvent.raise(undefined)
      }
    }
  }

  const value = {
    sidebarTitle,
    sidebarSubtitle,
    aboutWalkImgSrc,
    aboutWalkContent,
    credit,
    headerMBImgSrc,
    headerDImgSrc,
    activeMenuId: activeId,
    menuSwitch,
    menuSwitcherAction,
    menuSwitchEvent,
    weatherConfig,
    legendConfig,
    onSceneTargetClick
  }
  return (
    <DuiContext.Provider value={value}>
      {children}
    </DuiContext.Provider>
  )
}

export {
  DuiContextProvider,
  DuiContext
}
