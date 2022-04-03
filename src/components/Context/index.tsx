import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent'
import React, { createContext } from 'react'
import useSwitch from '../../utils/useSwitch'
import { ILegendDialogContentProps } from '../LeftMenuBar/Legend/LegendDialogContent'
import useTheme, { defaultStyle, StyleType } from './Theme/useTheme'

// make sure they match menuItem components's props
// these items should be same as DguidewalksApp component content
export const defaultMenuItems = [
  {
    id: '地圖圖層',
    name: '地圖圖層'
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
  credit: string
  headerMBImgSrc: string
  headerDImgSrc: string
  activeMenuId: string | undefined
  menuSwitcherAction: (id: string) => {
    onClick: () => void
    onClose: () => void
  },
  weatherConfig: WeatherConfig
  legendConfig: LegendConfig
}

export const initialDuiContext: DuiContextType = {
  sidebarTitle: '',
  sidebarSubtitle: '',
  credit: '本平臺由智紳數位文化事業有限公司建置。若有其他利用或授權需求請洽【智紳數位文化事業】Facebook粉絲專頁。',
  headerMBImgSrc: '',
  headerDImgSrc: '',
  activeMenuId: undefined,
  menuSwitcherAction: () => ({
    onClick: () => null,
    onClose: () => null
  }),
  weatherConfig: { token: undefined, locations: [] },
  legendConfig: { activeLegends: [] }
}

const DuiContext = createContext<DuiContextType>(initialDuiContext)

type MenuItemType = {
  id: string,
  name: string
}

export interface IDuiContextProviderProps {
  sidebarTitle: string
  sidebarSubtitle: string
  credit: string
  headerMBImgSrc: string
  headerDImgSrc: string
  menuSwitchItems: Array<MenuItemType>,
  weatherConfig: WeatherConfig
  legendConfig: LegendConfig
  themeConfig?: StyleType
}

const DuiContextProvider: React.FC<IDuiContextProviderProps> = ({
  sidebarTitle,
  sidebarSubtitle,
  credit,
  headerMBImgSrc,
  headerDImgSrc,
  children,
  weatherConfig,
  legendConfig,
  menuSwitchItems,
  themeConfig = defaultStyle
}) => {
  useTheme(themeConfig)
  const { switchById, activeId } = useSwitch<MenuItemType>([...defaultMenuItems, ...menuSwitchItems])
  const menuSwitcherAction = (id: string) => {
    return {
      onClick: () => switchById(id),
      onClose: () => switchById(undefined)
    }
  }

  const value = {
    sidebarTitle,
    sidebarSubtitle,
    credit,
    headerMBImgSrc,
    headerDImgSrc,
    activeMenuId: activeId,
    menuSwitcherAction,
    weatherConfig,
    legendConfig
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
