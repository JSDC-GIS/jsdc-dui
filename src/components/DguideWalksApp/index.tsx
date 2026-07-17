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
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import VisitorCount from '../VisitorCount'
import { mapKeys, omit, pick } from 'lodash'
import { useTranslation } from 'react-i18next'

export interface IDguideWalksAppProps {
  mainMenuChildren?: React.ReactNode
  endMenuChildren?: React.ReactNode
  /**
   * 初次訪客的預設語言（如 'en'）。僅在使用者尚未手動切換過（localStorage 無偏好）時套用；
   * 使用者用語言切換器切換後，其選擇會被持久化並在往後造訪勝出。
   */
  defaultLanguage?: string
}

const DguideWalksApp: React.FC<IDguideWalksAppProps> = ({
  mainMenuChildren,
  endMenuChildren,
  defaultLanguage,
}) => {
  const { i18n } = useTranslation()
  const {
    dgw: { layerNameOrder, apiProvider },
  } = useContext(DguidewalksContext)
  const dui = useContext(DuiContext)
  const { Jsdc, layerInfos } = useContext(JSDCContext)
  const [visitors, setVisitors] = useState(0)

  const orderedLayerInfos = useMemo(() => {
    const layerInfoMap = mapKeys(layerInfos, (info) => info.description.name)
    const matchedInfos = Object.values(pick(layerInfoMap, layerNameOrder))
    const restInfos = Object.values(omit(layerInfoMap, layerNameOrder))
    return [...matchedInfos, ...restInfos]
  }, [layerInfos, layerNameOrder])

  useEffect(() => {
    if (!defaultLanguage || typeof window === 'undefined') return
    // 不能用 i18nextLng 判斷「使用者是否選過」——language detector 在 init 時就會把
    // 解析後的語言（含 fallback zh-TW）寫進 i18nextLng，故改用獨立旗標只在「本瀏覽器
    // 第一次進站」時套用預設語言；日後使用者用切換器選擇會經 detector 持久化並自然勝出。
    const APPLIED_KEY = 'dui-i18n-default-applied'
    if (window.localStorage.getItem(APPLIED_KEY)) return
    window.localStorage.setItem(APPLIED_KEY, '1')
    i18n.changeLanguage(defaultLanguage)
  }, [])

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
            {
              <LegendMenuItem
                active={dui.activeMenuId === '圖例說明'}
                {...dui.menuSwitcherAction('圖例說明')}
                activeLegends={dui.legendConfig.activeLegends}
              />
            }
            <SettingMenuItem
              active={dui.activeMenuId === '工具設定'}
              {...dui.menuSwitcherAction('工具設定')}
            />
            {mainMenuChildren}
          </>
        </MenuList>
      }
    />
  )
}
DguideWalksApp.displayName = 'DguideWalksApp'
export default DguideWalksApp
