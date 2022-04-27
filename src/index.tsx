import * as ReactDOMClient from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import React, { useContext, useEffect, useState } from 'react';
import { JSDCContext, JSDCProvider } from './JSDC/Context'
import JSDC from './JSDC';
import { LayerApiRespVectorProps } from './JSDC/Dguidewalks/ApiProvider';
import Leaflet, { GeoJSON, Marker } from 'leaflet'
import { IDuiContextProviderProps, DuiContext, DuiContextProvider } from './components/Context';
import DguideWalksApp from './components/DguideWalksApp';
import Dialog from './components/Dialog';
import MenuItemWithDialog from './components/LeftMenuBar/MenuList/MenuItemWithDialog';
import icon, { baseUrl } from './icon';
import './style/index.css'
import { DguidewalksContext, DguidewalksProvider } from './JSDC/Dguidewalks/Context';


const duiConfigProps: IDuiContextProviderProps = {
  sidebarTitle: '標題1',
  sidebarSubtitle: '標題2',
  credit: '本平臺由智紳數位文化事業有限公司建置。若有其他利用或授權需求請洽【智紳數位文化事業】Facebook粉絲專頁。',
  headerMBImgSrc: '',
  headerDImgSrc: '',
  menuSwitchItems: [{ id: '景點打卡', name: '景點打卡' }],
  weatherConfig: {
    token: 'CWB-232A270E-12F1-4381-B9F2-DF2D2670A077',
    locations: [
      { county: '屏東縣', town: '枋寮鄉' },
      { county: '屏東縣', town: '春日鄉' }
    ]},
  legendConfig: {
    activeLegends: ['歷史建物', '聚落', '紀念指標']
  },
  themeConfig: {}
}

const getRouteColorByType = (type: string) => {
  switch (type) {
    case '1':
      return '#4aca69'
    case '2':
      return '#4aca69'
    default:
      return 'blue'
  }
}

const getPOIIcon = (type: string) => {
  return Leaflet.icon({ iconUrl: `${baseUrl}map_icons/type${type}.png`, iconSize: [30, 40] })
}

function App() {
  const { Jsdc } = useContext(JSDCContext)
  const dui = useContext(DuiContext)
  const { dgw } = useContext(DguidewalksContext)
  const [open, setopen] = useState(false)
  const [title, settitle] = useState<string>()

  const init = async () => {
    await Jsdc.asyncViewer
    const layerController = Jsdc.Controller.get('Layer')

    layerController
      .getByName<GeoJSON>('浸水營古道數位走讀示範路線')
      ?.forEachLayerAsGeoJSON<any, LayerApiRespVectorProps>(
        (layer, properties) => layer.setStyle({ color: getRouteColorByType(properties.type)})
      )

    layerController
      .getByName<GeoJSON>('浸水營古道數位走讀示範景點')
      ?.forEachLayerAsGeoJSON<any, LayerApiRespVectorProps>(
        (layer: Marker, properties) => {
          layer.setIcon(getPOIIcon(properties.type)!)
          layer.on('click', () => {
            setopen(true)
            settitle(properties.name)
          })
        })

  }
  useEffect(() => {
    (window as any).JSDC = Jsdc
    dgw.gisDataLoadEvent.addEventListener(init)
  }, [])
  return (
    
        <>
          <DguideWalksApp
            mainMenuChildren={
              <MenuItemWithDialog
                startIconSrc={icon.activable.info}
                startIconSrcActive={icon.activable.infoActive}
                title='景點打卡'
                active={dui.activeMenuId === '景點打卡'} {...dui.menuSwitcherAction('景點打卡')}>
                  <div>打卡</div>
              </MenuItemWithDialog>
            }/>
          <Dialog title={title} open={open} onClose={() => setopen(false)}/>
        </>
      
  );
}

const AppWrapper: React.FC = () => {
  const [Jsdc] = useState(new JSDC('aaaa'))
  return (
    <JSDCProvider Jsdc={Jsdc}>
      <DguidewalksProvider
        Jsdc={Jsdc}
        layersHiddenFromUI={['浸水營古道數位走讀示範景點', '浸水營古道數位走讀示範路線']}
        layersShowOnMapByDefault={['臺灣通用正射影像', 'a234']}
        baseApiUrl={'http://localhost:8444/api/'}>
        <DuiContextProvider {...duiConfigProps}>
          <App/>
        </DuiContextProvider>
      </DguidewalksProvider>
    </JSDCProvider>
  )
}


ReactDOMClient.createRoot(document.getElementById('root') as Element)
  .render(
    <AppWrapper />
  )

reportWebVitals();
