import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent'
import React, { createContext, useRef, useState } from 'react'
import useSwitch from '../../utils/useSwitch'
import { ILegendDialogContentProps } from '../LeftMenuBar/Legend/LegendDialogContent'
import useTheme, { defaultStyle, StyleType } from './Theme/useTheme'
import Event from '../../JSDC/utils/Event'
import { ISceneMenuItemProps } from '../LeftMenuBar/Scene/SceneMenuItem'
import useSceneController, {
  SceneConfig,
  SceneController,
} from '../../hooks/useSceneController'
import { SceneMarker } from '../../JSDC/Dguidewalks/scene'
import { SceneFeature } from '../../JSDC/Dguidewalks/ApiProvider'

export type { SceneConfig, SceneController }

// make sure they match menuItem components's props
// these items should be same as DguidewalksApp component content
export const defaultMenuItems = [
  {
    id: '地圖圖層',
    name: '地圖圖層',
  },
  {
    id: '景點介紹',
    name: '景點介紹',
  },
  {
    id: '氣象預測',
    name: '氣象預測',
  },
  {
    id: '圖例說明',
    name: '圖例說明',
  },
  {
    id: '工具設定',
    name: '工具設定',
  },
  {
    id: '路線顏色',
    name: '路線顏色',
  },
  {
    id: '路線介紹',
    name: '路線介紹',
  },
  {
    id: '關於圖臺',
    name: '關於圖臺',
  },
]

export type WeatherConfig = {
  disabled?: boolean
  token: string | undefined
  locations: IWeatherDialogContentProps['locations']
}

export type LegendConfig = {
  /** 隱藏整個「圖例說明」選單項目 */
  disabled?: boolean
  activeLegends: ILegendDialogContentProps['activeLegends']
}

export type SettingConfig = {
  /** 隱藏整個「工具設定」選單項目 */
  disabled?: boolean
  /** 保留「工具設定」，但隱藏其中的語言切換器 */
  languageSwitcherDisabled?: boolean
}

export type PathColorConfig = {
  /**
   * 顯示「路線顏色」選單項目。預設不顯示，要顯示的專案明確設成 `true`
   * （方向和 `settingConfig.disabled` 相反）。
   * 內容由 `mapConfig` 已載入的線圖層自動產生；沒有任何可列的線段時，開啟了也不會出現。
   */
  enabled?: boolean
}

export type DuiContextType = {
  sidebarTitle: string
  sidebarSubtitle: string
  aboutWalkImgSrc: string
  aboutWalkContent: string
  credit: string
  creditHref?: string
  headerMBImgSrc: string
  headerDImgSrc: string
  activeMenuId: string | undefined
  menuSwitch: (id: string | undefined) => void
  menuSwitcherAction: (id: string) => {
    onClick: () => void
    onClose: () => void
  }
  menuSwitchEvent: Event<string | undefined>
  weatherConfig: WeatherConfig
  legendConfig: LegendConfig
  settingConfig: SettingConfig
  pathColorConfig: PathColorConfig
  onSceneTargetClick: (feature: SceneFeature) => void
  onSceneNavigate: (feature: SceneFeature) => void
  sceneCardsReducer: ISceneMenuItemProps['cardsReducer']
  /** 景點內建行為的狀態，給 `SceneCheckin` 渲染用。 */
  scene: SceneController
  /** 開啟指定景點的集章卡片（不經過 `sceneConfig.onSceneClick`）。 */
  openSceneCard: (marker: SceneMarker) => void
  closeSceneCard: () => void
}

export const initialDuiContext = {}

const DuiContext = createContext<DuiContextType>(
  initialDuiContext as DuiContextType,
)

type MenuItemType = {
  id: string
  name: string
}

export interface IDuiContextProviderProps {
  children?: React.ReactNode
  sidebarTitle: string
  sidebarSubtitle: string
  aboutWalkImgSrc: string
  aboutWalkContent: string
  credit: string
  creditHref?: string
  headerMBImgSrc: string
  headerDImgSrc: string
  /** 下游自己加的選單項目 id（搭配 `mainMenuChildren` / `endMenuChildren`）；沒有自訂選單就不用傳 */
  menuSwitchItems?: Array<MenuItemType>
  weatherConfig: WeatherConfig
  legendConfig: LegendConfig
  settingConfig?: SettingConfig
  /** 內建的「路線顏色」選單。不傳就是不顯示；`{ enabled: true }` 開啟。 */
  pathColorConfig?: PathColorConfig
  themeConfig?: StyleType
  /**
   * 景點列表的定位鈕。預設飛到該景點（縮放層級見 `sceneConfig.targetZoom`）。
   * 參數是 Strapi 原樣的景點 feature（`feature.id`、`properties`、`geometry`），
   * 只會收到有座標的景點；需要 marker 時用 `dgw.findSceneById(feature.id)`。
   */
  onSceneTargetClick?: (feature: SceneFeature) => void
  /** 景點列表、集章卡片的導航鈕。預設用 Google 步行導航到該景點。參數同上。 */
  onSceneNavigate?: (feature: SceneFeature) => void
  sceneCardsReducer?: ISceneMenuItemProps['cardsReducer']
  /** 景點圖層的內建行為（點擊開卡片、cluster、集章、深連結）。不傳就是全部預設。 */
  sceneConfig?: SceneConfig
}

const DuiContextProvider: React.FC<IDuiContextProviderProps> = ({
  sidebarTitle,
  sidebarSubtitle,
  aboutWalkImgSrc,
  aboutWalkContent,
  credit,
  creditHref,
  headerMBImgSrc,
  headerDImgSrc,
  children,
  weatherConfig,
  legendConfig,
  settingConfig = {},
  pathColorConfig = {},
  menuSwitchItems = [],
  themeConfig = defaultStyle,
  onSceneTargetClick,
  onSceneNavigate,
  sceneCardsReducer,
  sceneConfig,
}) => {
  useTheme(themeConfig)
  const scene = useSceneController(sceneConfig)
  const { switchById, activeId } = useSwitch<MenuItemType>([
    ...defaultMenuItems,
    ...menuSwitchItems,
  ])
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
      },
    }
  }

  const value = {
    sidebarTitle,
    sidebarSubtitle,
    aboutWalkImgSrc,
    aboutWalkContent,
    credit,
    creditHref,
    headerMBImgSrc,
    headerDImgSrc,
    activeMenuId: activeId,
    menuSwitch,
    menuSwitcherAction,
    menuSwitchEvent,
    weatherConfig,
    legendConfig,
    settingConfig,
    pathColorConfig,
    onSceneTargetClick: onSceneTargetClick ?? scene.flyToScene,
    sceneCardsReducer,
    onSceneNavigate: onSceneNavigate ?? scene.navigateToScene,
    scene,
    openSceneCard: scene.openSceneCard,
    closeSceneCard: scene.closeSceneCard,
  }
  return <DuiContext.Provider value={value}>{children}</DuiContext.Provider>
}
DuiContextProvider.displayName = 'DuiContextProvider'
export { DuiContextProvider, DuiContext }
