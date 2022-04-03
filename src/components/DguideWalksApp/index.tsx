import CreditMenuItem from '../LeftMenuBar/Credit/CreditMenuItem'
import LayerMenuItem from '../LeftMenuBar/Layer/LayerMenuItem'
import LegendMenuItem from '../LeftMenuBar/Legend/LegendMenuItem'
import MenuList from '../LeftMenuBar/MenuList'
import WeatherMenuItem from '../LeftMenuBar/Weather/WeatherMenuItem'
import MapViewContainer from '../MapViewContainer'
import React, { useContext } from 'react'
import { RuiContext } from '../Context'
import { JSDCContext } from '../../JSDC/Context'
import { latLng } from 'leaflet'

export interface IDguideWalksAppProps {
  mainMenuChildren?: React.ReactNode
  endMenuChildren?: React.ReactNode
}

const DguideWalksApp: React.FC<IDguideWalksAppProps> = ({
  mainMenuChildren,
  endMenuChildren
}) => {
  const rui = useContext(RuiContext)
  const { Jsdc, layerInfos } = useContext(JSDCContext)
  
  return (
    <MapViewContainer
      Jsdc={Jsdc}
      headerImgSrc={rui.headerMBImgSrc}
      menuChildren={(
        <MenuList
          title={rui.sidebarTitle} subtitle={rui.sidebarSubtitle}
          headerImg={rui.headerDImgSrc} headerMBImg={rui.headerMBImgSrc}
          endChildren={
            <>
              <CreditMenuItem
                active={rui.activeMenuId === '關於圖台'} {...rui.menuSwitcherAction('關於圖台')}
                description={rui.credit}/>
              {endMenuChildren}
            </>
          }>
          <>
            <LayerMenuItem
              layerInfos={layerInfos.map(item => ({
                id: item.id,
                type: item.description.type,
                name: item.description.name,
                show: item.show
              }))}
              onToggleShow={(id, show) => Jsdc.Controller.get('Layer').getById(id).show = show}
              onOpacityChange={(id, opacity) => Jsdc.Controller.get('Layer').getById(id).setOpacity( Number( 1 - ( opacity/ 100 ) ) )}
              active={rui.activeMenuId === '地圖圖層'} {...rui.menuSwitcherAction('地圖圖層')}/>
            {
              rui.weatherConfig.disabled || (
                <WeatherMenuItem active={rui.activeMenuId === '氣象預測'} {...rui.menuSwitcherAction('氣象預測')}
                  locations={rui.weatherConfig.locations}
                  token={rui.weatherConfig.token!}
                  onSelectLocation={([y, x]) => Jsdc.viewer?.flyTo(latLng(y, x), 13)}/>
              )
            }
            {
              rui.legendConfig.disabled || (
                <LegendMenuItem
                  active={rui.activeMenuId === '圖例說明'} {...rui.menuSwitcherAction('圖例說明')}
                  activeLegends={rui.legendConfig.activeLegends}/>
              )
            }
            {mainMenuChildren}
          </>
        </MenuList>
      )}/>
  )
}

export default DguideWalksApp
