import * as ReactDOMClient from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import React, { useContext, useEffect, useState } from 'react'
import { JSDCContext, JSDCProvider } from './JSDC/Context'
import JSDC from './JSDC'
import ApiProvider, {
  LayerApiRespVectorProps,
} from './JSDC/Dguidewalks/ApiProvider'
import Leaflet, { GeoJSON, latLng, latLngBounds, Marker } from 'leaflet'
import {
  IDuiContextProviderProps,
  DuiContext,
  DuiContextProvider,
} from './components/Context'
import DguideWalksApp from './components/DguideWalksApp'
import Dialog from './components/Dialog'
import MenuItemWithDialog from './components/LeftMenuBar/MenuList/MenuItemWithDialog'
import { baseUrl } from './icon'
import './style/index.css'
import {
  DguidewalksContext,
  DguidewalksProvider,
} from './JSDC/Dguidewalks/Context'
import LeafletPopup, {
  bindPopupWithSceneCard,
  bindPopupWithComponent,
} from './components/LeafletPopup'
import Checkin from './components/Icons/Checkin'
import { renderToString } from 'react-dom/server'
import ResponsiveDialog from './components/ResponsiveDialog'
import SceneCard, { ISceneCardProps } from './components/LeafletPopup/SceneCard'
import useHeatMap from './JSDC/hooks/layerVisualization/useHeatMap'
import JSDCGeoJSONLayer from './JSDC/Layer/JSDCGeoJSONLayer'
import useCluster from './JSDC/hooks/layerVisualization/useCluster'
import GeoNavigator, {
  IGeoNavigatorProps,
  Navigation,
} from './components/GeoNavigator'
import {
  Article,
  SummaryArticleType,
} from './JSDC/Dguidewalks/proxyParser/@types'
import ArticleProxyParser from './JSDC/Dguidewalks/proxyParser'
import DaKeKanRiver2022Parser from './JSDC/Dguidewalks/proxyParser/DaKeKanRiver2022Parser'
import { AbsctractArticleProxyParserContructor } from './JSDC/Dguidewalks/proxyParser/AbsctractArticleProxyParser'
import ConfigProvider from './JSDC/Dguidewalks/ConfigProvider'
import CheckInCard from './components/LeafletPopup/CheckInCard'
import useGeolocation from './hooks/useGeolocation'
import useGoogleNavigator, {
  GoogleNavigationType,
} from './hooks/useGoogleNavigator'

const duiConfigProps: IDuiContextProviderProps = {
  sidebarTitle: '標題1',
  sidebarSubtitle: '標題2',
  aboutWalkImgSrc:
    'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
  aboutWalkContent:
    '橫越屏東縣春日鄉和臺東縣大武鄉的浸水營古道，始於1885年開鑿，自水底寮進抵大武，全長約64公里，海拔均高1,000公尺，為當時臺灣東、西部往返的重要道路，據傳平埔族人曾經藉此遷移至東部地區。日治時期，浸水營古道因低海拔和距離短的條件，被臺灣總督府用於連接東、西部的電信郵遞，直到1914年發生「南蕃事件」，致使道路中斷數年。最後，整條浸水營古道的復舊工事於1917年完成，同時增設了大樹林駐在所與古里巴保諾駐在所。',
  credit: `一、本圖台由屏東縣牡丹鄉公所及智紳數位文化事業有限公司共同協力建置：
  1.圖台內容：屏東縣牡丹鄉公所及鄉民提供。
  2.圖台系統開發：智紳數位文化事業有限公司。
  二、本圖台內容其內容著作財產權由上述單位及個人保有並授權予牡丹鄉公所各項非商業行為使用。若有其他利用或授權需求請洽【<a href="https://www.facebook.com/JRSHENDigitalCulture/">智紳數位文化事業</a>】Facebook粉絲專頁。`,
  creditHref: 'https://www.facebook.com/JRSHENDigitalCulture/',
  headerMBImgSrc:
    'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
  headerDImgSrc:
    'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
  menuSwitchItems: [{ id: '景點打卡', name: '景點打卡' }],
  weatherConfig: {
    token: 'CWB-232A270E-12F1-4381-B9F2-DF2D2670A077',
    locations: [
      { county: '屏東縣', town: '牡丹鄉' },
      { county: '屏東縣', town: '車城鄉' },
      { county: '屏東縣', town: '滿州鄉' },
    ],
  },
  legendConfig: {
    activeLegends: ['歷史建物', '聚落', '紀念指標'],
  },
  themeConfig: {
    '--dui-primary': '#EB9D1D',
    '--dui-accent': '#C95843',
    '--dui-secondary': '#EB9D1D',
    '--dui-bg-secondary': '#EB9D1D',
    '--dui-bg-accent': '#EB9D1D',
  },
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
  return Leaflet.icon({
    iconUrl: `${baseUrl}map_icons/type${type}.svg`,
    iconSize: [30, 40],
  })
}

function App() {
  const { Jsdc } = useContext(JSDCContext)
  const dui = useContext(DuiContext)
  const { dgw, geolocation } = useContext(DguidewalksContext)
  const [open, setopen] = useState(false)
  const [title, settitle] = useState<string>()
  const [props, setProps] = useState<Partial<ISceneCardProps>>()
  const [naviOD, setNaviOD] = useState<{
    origin: [number, number]
    destination: [number, number]
    type: Navigation
  }>()
  const {
    addLayer: addLayerToHeatMap,
    toggleShowHeatMap,
    show: showHeatMap,
  } = useHeatMap(Jsdc.asyncViewer)
  const {
    addLayer: addLayerToCluster,
    toggleShowCluster,
    show: showCluster,
  } = useCluster(Jsdc.asyncViewer)
  const [data, setData] = useState<string>()

  const handleToggleHeatmap = () => {
    toggleShowHeatMap()
  }
  const handleToggleCluster = () => {
    toggleShowCluster()
  }

  const handleOpenNavigate = (type: Navigation) => {
    setNaviOD({
      origin: [24.980077143207907, 121.53545142928155],
      destination: [24.998748116199845, 121.51991607604738],
      type,
    })
  }

  const init = async () => {
    await Jsdc.asyncViewer
    const layerController = Jsdc.Controller.get('Layer')
    const layer1 = layerController.getByName<GeoJSON>(
      '浸水營古道數位走讀示範路線',
    ) as JSDCGeoJSONLayer
    const layer2 = layerController.getByName<GeoJSON>(
      'n0004-point',
    ) as JSDCGeoJSONLayer

    layer1?.forEachLayerAsGeoJSON<any, LayerApiRespVectorProps>(
      (layer, properties) =>
        layer.setStyle({ color: getRouteColorByType(properties.type) }),
    )
    layer2?.forEachLayerAsGeoJSON<any, LayerApiRespVectorProps>(
      (layer: Marker, properties) => {
        layer.setIcon(getPOIIcon(properties.type)!)
        layer.on('click', async () => {
          setProps({})
          setopen(true)
          const sceneData = await dgw.getSceneDetailArticleByTitle(
            properties.name,
            properties.url,
          )
          const props = {
            sceneLatLng: layer.getLatLng(),
            title: properties.name,
            subtitle: sceneData.subtitle,
            imgSrc: sceneData.imgSrc,
            mainTextContent: sceneData.content,
            credit: sceneData.ref,
          }
          setProps(props)
        })
        // const handleFetchArticle = async () => {
        //   const actionLabel = '打卡集章'
        //   const sceneData = await dgw.getSceneDetailArticleByTitle(properties.name, properties.url)
        //   const props = {
        //     title: properties.name,
        //     subtitle: sceneData.subtitle,
        //     imgSrc: sceneData.imgSrc,
        //     mainTextContent: sceneData.content,
        //     credit: sceneData.ref
        //   }
        //   const content = renderToString(LeafletPopup.SceneCard({ ...props }))
        //   layer.bindPopup(content)

        //   const button = document.getElementById(actionLabel)
        //   button?.addEventListener('click', handleActionClick)
        // }
        // bindPopupWithSceneCard(layer, renderToString, {
        //   dgw,
        //   title: properties.name
        // })

        // bindPopupWithTable(layer, {
        //   name: properties.name,
        //   value: properties
        // })

        // bindPopupWithComponent(layer, {
        //   Component: LeafletPopup.SceneCard,
        //   props: {},
        //   onLayerClick: handleFetchArticle
        // })
      },
    )
    layer2 && addLayerToHeatMap(layer2)
    layer2 && addLayerToCluster(layer2)
    dui.menuSwitchEvent.addEventListener(() => setopen(false))
  }
  useEffect(() => {
    ;(window as any).JSDC = Jsdc
    dgw.gisDataLoadEvent.addEventListener(init)
    window.addEventListener('message', (e) => {
      if (e.data.source === 'child') {
        setData(JSON.stringify(e.data))
      }
    })
  }, [])
  return (
    <>
      <DguideWalksApp
        mainMenuChildren={
          <MenuItemWithDialog
            Icon={Checkin}
            title="景點打卡"
            active={dui.activeMenuId === '景點打卡'}
            {...dui.menuSwitcherAction('景點打卡')}
          >
            <button
              style={{ background: showHeatMap ? 'yellow' : 'white' }}
              onClick={handleToggleHeatmap}
            >
              hopspot
            </button>
            <button
              style={{ background: showCluster ? 'yellow' : 'white' }}
              onClick={handleToggleCluster}
            >
              cluster
            </button>
            <button onClick={() => handleOpenNavigate(Navigation.Walk)}>
              navigator walk
            </button>
            <button onClick={() => handleOpenNavigate(Navigation.MassTransit)}>
              navigator MassTransit
            </button>
            <button onClick={() => handleOpenNavigate(Navigation.Car)}>
              navigator Car
            </button>
            <button onClick={() => handleOpenNavigate(Navigation.Bike)}>
              navigator Bike
            </button>
            <iframe src="./child.html"></iframe>
            <span>render from parent: {data}</span>
          </MenuItemWithDialog>
        }
      />
      <ResponsiveDialog open={open} onClose={() => setopen(false)}>
        <CheckInCard {...props} userLatLng={geolocation.latLng} />
      </ResponsiveDialog>
      {naviOD && <GeoNavigator {...naviOD} />}
    </>
  )
}

const cmsPath = [
  '數位走讀地圖/北部景點/大嵙崁溪河階/2022三層·內柵·三坑情',
  // '數位走讀地圖/南部景點/牡丹社事件'
]
const eventId = 'n0004'

const config = new ConfigProvider({
  eventId,
  cmsPath,
  // baseApiUrl: 'http://localhost:8444/api/'
})

const defaultParser = new DaKeKanRiver2022Parser(eventId, {
  cmsPath,
  proxyFetcher: new ApiProvider(config).getProxyQuery,
})

console.log(defaultParser)

const AppWrapper = () => {
  const { openNavigator } = useGoogleNavigator()
  const [Jsdc] = useState(
    new JSDC(eventId, {
      bound: latLngBounds(latLng(21.7927, 119.8553), latLng(22.9533, 121.7477)),
      maxZoom: 19,
    }),
  )
  const forExactLayerName = (
    layerName: string,
    title: string,
    cb: (layer: Marker) => void,
  ) => {
    const targetFeature = Jsdc.Controller.get('Layer')
      .getByName(layerName)
      ?.isGeoJSON()
    if (!targetFeature) return
    const layers = targetFeature.instance.getLayers() as Marker[]
    for (const layer of layers) {
      const layerName = layer.feature?.properties.name
      if (!layerName) continue
      if (title.includes(String(layerName))) {
        cb(layer)
        break
      }
    }
  }

  const handleSceneTagetClick = (title: string) => {
    forExactLayerName('n0004-point', title, (layer) =>
      Jsdc.viewer?.flyTo(layer.getLatLng(), 17),
    )
  }

  const handleSceneNavigate = (title: string) => {
    forExactLayerName('n0004-point', title, (layer) => {
      const { lat: destLat, lng: destLng } = layer.getLatLng()
      // const origin = location.latLng
      // if (!origin) return

      openNavigator({
        origin: [24.906019424067743, 121.30963485844617],
        destination: [destLat, destLng],
        type: GoogleNavigationType.Walk,
      })
    })
  }
  const reduceSceneCards = (data: Article[]) => {
    return data
  }
  return (
    <>
      <JSDCProvider Jsdc={Jsdc}>
        <DguidewalksProvider
          Jsdc={Jsdc}
          articleParser={defaultParser}
          layersHiddenFromUI={['測試路線']}
          layersShowOnMapByDefault={[
            '臺灣通用電子地圖(灰階)',
            'n0004-point',
            'n0004-line',
          ]}
          layerNameOrder={['牡丹社路線']}
          config={config}
          layerLegendImages={{
            '臺灣通用電子地圖(灰階)':
              'https://map.jsdc.com.tw/webgis/dguidewalks/s0002/static/img/intro-photo.fd72e6c.png',
          }}
        >
          <DuiContextProvider
            {...duiConfigProps}
            onSceneTargetClick={handleSceneTagetClick}
            sceneCardsReducer={reduceSceneCards}
            onSceneNavigate={handleSceneNavigate}
          >
            <App />
          </DuiContextProvider>
        </DguidewalksProvider>
      </JSDCProvider>
    </>
  )
}

ReactDOMClient.createRoot(document.getElementById('root') as Element).render(
  <AppWrapper />,
)

reportWebVitals()
