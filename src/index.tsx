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
import { baseUrl } from './icon';
import './style/index.css'
import { DguidewalksContext, DguidewalksProvider } from './JSDC/Dguidewalks/Context';
import LeafletPopup, { bindPopupWithSceneCard, bindPopupWithComponent } from './components/LeafletPopup';
import Checkin from './components/Icons/Checkin';
import { renderToString } from 'react-dom/server';

const duiConfigProps: IDuiContextProviderProps = {
  sidebarTitle: '標題1',
  sidebarSubtitle: '標題2',
  aboutWalkImgSrc: 'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
  aboutWalkContent: '橫越屏東縣春日鄉和臺東縣大武鄉的浸水營古道，始於1885年開鑿，自水底寮進抵大武，全長約64公里，海拔均高1,000公尺，為當時臺灣東、西部往返的重要道路，據傳平埔族人曾經藉此遷移至東部地區。日治時期，浸水營古道因低海拔和距離短的條件，被臺灣總督府用於連接東、西部的電信郵遞，直到1914年發生「南蕃事件」，致使道路中斷數年。最後，整條浸水營古道的復舊工事於1917年完成，同時增設了大樹林駐在所與古里巴保諾駐在所。',
  credit: '本平臺由智紳數位文化事業有限公司建置。若有其他利用或授權需求請洽【智紳數位文化事業】Facebook粉絲專頁。',
  headerMBImgSrc: 'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
  headerDImgSrc: 'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
  menuSwitchItems: [{ id: '景點打卡', name: '景點打卡' }],
  weatherConfig: {
    token: 'CWB-232A270E-12F1-4381-B9F2-DF2D2670A077',
    locations: [
      { county: '屏東縣', town: '牡丹鄉' },
      { county: '屏東縣', town: '車城鄉' },
      { county: '屏東縣', town: '滿州鄉' }
    ]},
  legendConfig: {
    activeLegends: ['歷史建物', '聚落', '紀念指標']
  },
  themeConfig: {
    '--dui-primary': '#ab3916',
    '--dui-secondary': '#F1C385'
  }
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
      .getByName<GeoJSON>('a234')
      ?.forEachLayerAsGeoJSON<any, LayerApiRespVectorProps>(
        (layer: Marker, properties) => {
          layer.setIcon(getPOIIcon(properties.type)!)
          const handleActionClick = () => {
            console.log(properties.name)
          }
          const handleFetchArticle = async () => {
            const actionLabel = '打卡集章'
            const sceneData = await dgw.getSceneDetailArticleByTitle(properties.name)
            const props = {
              title: sceneData.title,
              subtitle: sceneData.subtitle,
              imgSrc: sceneData.imgSrc,
              mainTextContent: sceneData.content,
              credit: sceneData.ref
            }
            const content = renderToString(LeafletPopup.SceneCard({ ...props }))
            layer.bindPopup(content)
        
            const button = document.getElementById(actionLabel)
            button?.addEventListener('click', handleActionClick)
          }
          bindPopupWithSceneCard(layer, renderToString, {
            dgw,
            title: properties.name
          })

          // bindPopupWithTable(layer, {
          //   name: properties.name,
          //   value: properties
          // })

          // bindPopupWithComponent(layer, {
          //   Component: LeafletPopup.SceneCard,
          //   props: {},
          //   onLayerClick: handleFetchArticle
          // })
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
                Icon={Checkin}
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
  const [Jsdc] = useState(new JSDC('s0003'))
  const handleSceneTagetClick = (title: string) => {
    const targetFeature = Jsdc.Controller.get('Layer').getByName('a234')?.isGeoJSON()
    if (!targetFeature) return
    const layers = targetFeature.instance.getLayers() as Marker[]
    for (const layer of layers) {
      const layerName = layer.feature?.properties.name
      if (!layerName) continue
      if (title.includes(String(layerName))) {
        Jsdc.viewer?.flyTo(layer.getLatLng(), 17)
        break
      }
    }
  }
  return (
    <JSDCProvider Jsdc={Jsdc}>
      <DguidewalksProvider
        Jsdc={Jsdc}
        layersHiddenFromUI={['浸水營古道數位走讀示範景點', '浸水營古道數位走讀示範路線']}
        layersShowOnMapByDefault={['臺灣通用正射影像', 'a234']}
        // baseApiUrl={'http://localhost:8444/api/'}
        cmsPath='數位走讀地圖/浸水營古道'>
        <DuiContextProvider {...duiConfigProps} onSceneTargetClick={handleSceneTagetClick}>
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
