import CreditMenuItem from '../LeftMenuBar/Credit/CreditMenuItem'
import LayerMenuItem from '../LeftMenuBar/Layer/LayerMenuItem'
import LegendMenuItem from '../LeftMenuBar/Legend/LegendMenuItem'
import MenuList from '../LeftMenuBar/MenuList'
import WeatherMenuItem from '../LeftMenuBar/Weather/WeatherMenuItem'
import MapViewContainer from '../MapViewContainer'
import React, { useContext } from 'react'
import { DuiContext } from '../Context'
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
  const dui = useContext(DuiContext)
  const { Jsdc, layerInfos } = useContext(JSDCContext)
  
  return (
    <MapViewContainer
      Jsdc={Jsdc}
      headerImgSrc={dui.headerMBImgSrc}
      menuChildren={(
        <MenuList
          title={dui.sidebarTitle} subtitle={dui.sidebarSubtitle}
          headerImg={dui.headerDImgSrc} headerMBImg={dui.headerMBImgSrc}
          endChildren={
            <>
              <CreditMenuItem
                active={dui.activeMenuId === '關於圖台'} {...dui.menuSwitcherAction('關於圖台')}
                description={dui.credit}/>
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
              active={dui.activeMenuId === '地圖圖層'} {...dui.menuSwitcherAction('地圖圖層')}/>
            {
              dui.weatherConfig.disabled || (
                <WeatherMenuItem active={dui.activeMenuId === '氣象預測'} {...dui.menuSwitcherAction('氣象預測')}
                  locations={dui.weatherConfig.locations}
                  token={dui.weatherConfig.token!}
                  onSelectLocation={([y, x]) => Jsdc.viewer?.flyTo(latLng(y, x), 13)}/>
              )
            }
            {
              dui.legendConfig.disabled || (
                <LegendMenuItem
                  active={dui.activeMenuId === '圖例說明'} {...dui.menuSwitcherAction('圖例說明')}
                  activeLegends={dui.legendConfig.activeLegends}/>
              )
            }
            {mainMenuChildren}
          </>
        </MenuList>
      )}/>
  )
}

export default DguideWalksApp
