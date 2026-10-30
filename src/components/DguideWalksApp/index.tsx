import CreditMenuItem from '../LeftMenuBar/Credit/CreditMenuItem'
import LayerMenuItem from '../LeftMenuBar/Layer/LayerMenuItem'
import LegendMenuItem from '../LeftMenuBar/Legend/LegendMenuItem'
import MenuList from '../LeftMenuBar/MenuList'
import WeatherMenuItem from '../LeftMenuBar/Weather/WeatherMenuItem'
import MapViewContainer from '../MapViewContainer'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { DuiContext } from '../Context'
import { JSDCContext } from '../../JSDC/Context'
import { latLng } from 'leaflet'
import SceneMenuItem from '../LeftMenuBar/Scene/SceneMenuItem'
import AboutWalkMenuItem from '../LeftMenuBar/AboutWalk/AboutWalkMenuItem'
import SettingMenuItem from '../LeftMenuBar/Setting/SettingMenuItem'
import PathColorMenuItem from '../LeftMenuBar/PathColor/PathColorMenuItem'
import usePathColors from '../../hooks/usePathColors'
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import VisitorCount from '../VisitorCount'
import SceneCheckin from '../SceneCheckin'
import { sortByLayerNameOrder } from '../../JSDC/Dguidewalks/mapLayers'
import { useTranslation } from 'react-i18next'
import { applyFixedLanguage, scopedStorageKey, DuiLanguage } from '../../i18n/config'

export interface IDguideWalksAppProps {
  mainMenuChildren?: React.ReactNode
  endMenuChildren?: React.ReactNode
  /**
   * 初次訪客的預設語言（如 'en'）。僅在使用者尚未手動切換過（localStorage 無偏好）時套用；
   * 使用者用語言切換器切換後，其選擇會被持久化並在往後造訪勝出。
   * 有語言切換器的雙語站台用這個。
   */
  defaultLanguage?: string
  /**
   * 固定語言：無條件使用指定語言，不讀也不寫 localStorage。
   * 單語系、藏掉語言切換器（`settingConfig.disabled`）的站台用這個，
   * 否則會被同一個 host 底下其他專案留下的語言偏好鎖住。
   * 與 `defaultLanguage` 同時傳時以 `language` 為準。
   */
  language?: DuiLanguage
}

const DguideWalksApp: React.FC<IDguideWalksAppProps> = ({
  mainMenuChildren,
  endMenuChildren,
  defaultLanguage,
  language,
}) => {
  const { i18n } = useTranslation()
  // 固定語言要在第一次 render 前就套用，否則會先閃一下 localStorage 裡的語言再跳回來
  useState(() => {
    if (language) applyFixedLanguage(language)
  })
  const { dgw } = useContext(DguidewalksContext)
  const { layerNameOrder, apiProvider } = dgw
  const dui = useContext(DuiContext)
  const { Jsdc, layerInfos } = useContext(JSDCContext)
  const [visitors, setVisitors] = useState(0)
  const pathColors = usePathColors()

  const orderedLayerInfos = useMemo(
    () => sortByLayerNameOrder(layerInfos, layerNameOrder),
    [layerInfos, layerNameOrder],
  )

  useEffect(() => {
    if (language) applyFixedLanguage(language)
  }, [language])

  useEffect(() => {
    if (language && defaultLanguage && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[jsdc-dui] DguideWalksApp 同時收到 language 與 defaultLanguage，以 language 為準。',
      )
    }
    if (language || !defaultLanguage || typeof window === 'undefined') return
    // 不能用 i18nextLng 判斷「使用者是否選過」——language detector 在 init 時就會把
    // 解析後的語言（含 fallback zh-TW）寫進 i18nextLng，故改用獨立旗標只在「本瀏覽器
    // 第一次進站」時套用預設語言；日後使用者用切換器選擇會經 detector 持久化並自然勝出。
    // 旗標與 i18nextLng 一樣依專案路徑隔離，不然先逛過別的專案就會讓這裡的預設語言失效。
    const APPLIED_KEY = scopedStorageKey('dui-i18n-default-applied')
    if (window.localStorage.getItem(APPLIED_KEY)) return
    window.localStorage.setItem(APPLIED_KEY, '1')
    i18n.changeLanguage(defaultLanguage)
  }, [])

  // 下游可能直接呼叫 dgw.articleProxyParser（不經過列表或卡片），若使用者沒開過
  // 「景點介紹」，parser 還會停在預設語系，故在此同步一次。
  useEffect(() => {
    dgw.articleProxyParser.setLanguage(i18n.language)
  }, [dgw, i18n.language])

  useEffect(() => {
    ;(async () => {
      try {
        const { counter } = await apiProvider.getVisitorCount()
        setVisitors(counter)
      } catch (err) {
        setVisitors(0)
      }
    })()
  }, [])

  return (
    <>
      <MapViewContainer
        Jsdc={Jsdc}
        headerImgSrc={dui.headerMBImgSrc}
        mapChildren={<VisitorCount value={visitors} />}
        menuChildren={
          <MenuList
            title={dui.sidebarTitle}
            subtitle={dui.sidebarSubtitle}
            headerImg={dui.headerDImgSrc}
            headerMBImg={dui.headerMBImgSrc}
            endChildren={
              <>
                <AboutWalkMenuItem
                  imgSrc={dui.aboutWalkImgSrc}
                  title={dui.sidebarTitle}
                  subtitle={dui.sidebarSubtitle}
                  content={dui.aboutWalkContent}
                  active={dui.activeMenuId === '路線介紹'}
                  {...dui.menuSwitcherAction('路線介紹')}
                />
                <CreditMenuItem
                  active={dui.activeMenuId === '關於圖臺'}
                  {...dui.menuSwitcherAction('關於圖臺')}
                  herf={dui.creditHref}
                  description={dui.credit}
                />
                {endMenuChildren}
              </>
            }
          >
            <>
              <LayerMenuItem
                layerInfos={orderedLayerInfos.map((item) => ({
                  id: item.id,
                  type: item.description.type,
                  name: item.description.name,
                  nameEn: item.description.nameEn,
                  show: item.show,
                }))}
                onToggleShow={(id, show) =>
                  (Jsdc.Controller.get('Layer').getById(id).show = show)
                }
                onOpacityChange={(id, opacity) =>
                  Jsdc.Controller.get('Layer')
                    .getById(id)
                    .setOpacity(Number(1 - opacity / 100))
                }
                active={dui.activeMenuId === '地圖圖層'}
                {...dui.menuSwitcherAction('地圖圖層')}
              />
              <SceneMenuItem
                onTarget={dui.onSceneTargetClick}
                onNavigate={dui.onSceneNavigate}
                cardsReducer={dui.sceneCardsReducer}
                active={dui.activeMenuId === '景點介紹'}
                {...dui.menuSwitcherAction('景點介紹')}
              />
              {dui.weatherConfig.disabled || (
                <WeatherMenuItem
                  active={dui.activeMenuId === '氣象預測'}
                  {...dui.menuSwitcherAction('氣象預測')}
                  locations={dui.weatherConfig.locations}
                  token={dui.weatherConfig.token!}
                  onSelectLocation={([y, x]) =>
                    Jsdc.viewer?.flyTo(latLng(y, x), 13)
                  }
                />
              )}
              {dui.legendConfig.disabled || (
                <LegendMenuItem
                  active={dui.activeMenuId === '圖例說明'}
                  {...dui.menuSwitcherAction('圖例說明')}
                  // 還不確定要亮哪些類別時先不畫（undefined），避免閃一下全灰
                  activeLegends={
                    dui.legendReady ? dui.legendConfig.activeLegends : undefined
                  }
                />
              )}
              {dui.settingConfig.disabled || (
                <SettingMenuItem
                  active={dui.activeMenuId === '工具設定'}
                  languageSwitcherDisabled={
                    dui.settingConfig.languageSwitcherDisabled
                  }
                  {...dui.menuSwitcherAction('工具設定')}
                />
              )}
              {/* 預設不顯示；開啟了但沒有可列的線段時也不渲染 */}
              {dui.pathColorConfig.enabled && pathColors.length > 0 && (
                <PathColorMenuItem
                  items={pathColors}
                  active={dui.activeMenuId === '路線顏色'}
                  {...dui.menuSwitcherAction('路線顏色')}
                />
              )}
              {mainMenuChildren}
            </>
          </MenuList>
        }
      />
      <SceneCheckin />
    </>
  )
}
DguideWalksApp.displayName = 'DguideWalksApp'
export default DguideWalksApp
