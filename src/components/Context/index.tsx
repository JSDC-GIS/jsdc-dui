import { IWeatherDialogContentProps } from '../LeftMenuBar/Weather/WeatherDialogContent'
import React, { createContext, useMemo, useState } from 'react'
import useSwitch from '../../utils/useSwitch'
import { LegendName } from '../../icon'
import useTheme, { defaultStyle, StyleType } from './Theme/useTheme'
import Event from '../../JSDC/utils/Event'
import { ISceneMenuItemProps } from '../LeftMenuBar/Scene/SceneMenuItem'
import useSceneController, {
  SceneConfig,
  SceneController,
} from '../../hooks/useSceneController'
import { SceneMarker } from '../../JSDC/Dguidewalks/scene'
import { SceneFeature } from '../../JSDC/Dguidewalks/ApiProvider'
import {
  getLegendNamesFromCategories,
  resolveViewerImages,
} from '../../JSDC/Dguidewalks/viewerAssets'
import useWalk from '../../hooks/useWalk'
import useViewerHeadIcons from '../../hooks/useViewerHeadIcons'

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
  /**
   * 要亮起來（彩色）的類別名稱。不傳就跟著 Strapi：用 `/walks` 回應的 `categories[].name`，
   * 也就是這條路線實際用到的類別。有傳就照傳入的清單（給想自訂的專案覆寫）。
   */
  activeLegends?: LegendName[]
}

/** context 裡算好的圖例設定：`activeLegends` 一定是陣列。 */
export type ResolvedLegendConfig = LegendConfig & {
  activeLegends: LegendName[]
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
  /**
   * 「路線介紹」的圖、手機版橫幅、桌機版主視覺：已經算好的值——Strapi `viewerAssets`
   * 對應欄位有值就是它，否則是下游傳的 prop；兩者都沒有時是空字串（不要渲染圖）。
   */
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
  /** `activeLegends` 是算好的值：下游有傳用下游的，否則是 Strapi 的 `categories`。 */
  legendConfig: ResolvedLegendConfig
  /**
   * 圖例要亮哪些類別是否已經確定。下游沒傳 `activeLegends` 時要等 `/walks` 回來，
   * 在那之前是 false（圖例先不畫，避免閃一下全灰）。
   */
  legendReady: boolean
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
  /**
   * 「路線介紹」對話框裡的圖。選填：Strapi 的 `viewerAssets.about` 有值時用 Strapi 的，
   * 這裡傳的是沒有值時（含 `/walks` 回來之前）的 fallback。
   */
  aboutWalkImgSrc?: string
  aboutWalkContent: string
  credit: string
  creditHref?: string
  /**
   * 手機版橫幅的 fallback（Strapi：`viewerAssets.headerMobile`）。
   * `sceneConfig.checkinKanbanImgSrc` 沒傳時，集章對話框上方也用這張算好的橫幅。
   */
  headerMBImgSrc?: string
  /** 桌機版左側選單主視覺的 fallback（Strapi：`viewerAssets.headerDesktop`）。 */
  headerDImgSrc?: string
  /** 下游自己加的選單項目 id（搭配 `mainMenuChildren` / `endMenuChildren`）；沒有自訂選單就不用傳 */
  menuSwitchItems?: Array<MenuItemType>
  weatherConfig: WeatherConfig
  /** 不傳就是預設：顯示「圖例說明」，亮起來的類別跟著 Strapi 的 `categories`。 */
  legendConfig?: LegendConfig
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
  legendConfig = {},
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
  // 圖片與圖例跟著 Strapi 走，和圖層、景點共用同一次 /walks 請求
  const { walk, settled } = useWalk()
  const viewerAssets = walk?.viewerAssets
  useViewerHeadIcons(viewerAssets)
  const images = useMemo(
    () =>
      resolveViewerImages(viewerAssets, {
        headerDImgSrc,
        headerMBImgSrc,
        aboutWalkImgSrc,
      }),
    [viewerAssets, headerDImgSrc, headerMBImgSrc, aboutWalkImgSrc],
  )
  const categoryLegends = useMemo(
    () => getLegendNamesFromCategories(walk?.categories),
    [walk],
  )
  const resolvedLegendConfig = useMemo(
    () => ({
      ...legendConfig,
      activeLegends: legendConfig.activeLegends ?? categoryLegends,
    }),
    [legendConfig, categoryLegends],
  )
  // 集章對話框上方的圖：下游有明確傳就用下游的（刻意的覆寫），沒傳用算好的手機版橫幅
  const scene = useSceneController({
    ...sceneConfig,
    checkinKanbanImgSrc:
      sceneConfig?.checkinKanbanImgSrc ?? (images.headerMBImgSrc || undefined),
  })
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
    aboutWalkImgSrc: images.aboutWalkImgSrc,
    aboutWalkContent,
    credit,
    creditHref,
    headerMBImgSrc: images.headerMBImgSrc,
    headerDImgSrc: images.headerDImgSrc,
    activeMenuId: activeId,
    menuSwitch,
    menuSwitcherAction,
    menuSwitchEvent,
    weatherConfig,
    legendConfig: resolvedLegendConfig,
    legendReady: !!legendConfig.activeLegends || settled,
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
