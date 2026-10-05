import * as ReactDOMClient from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import React, { useContext, useEffect, useState } from 'react'
import { JSDCContext, JSDCProvider } from './JSDC/Context'
import JSDC from './JSDC'
import './i18n/config'
import { LayerApiRespVectorProps } from './JSDC/Dguidewalks/ApiProvider'
import { GeoJSON, latLng, latLngBounds } from 'leaflet'
import {
  IDuiContextProviderProps,
  DuiContext,
  DuiContextProvider,
} from './components/Context'
import DguideWalksApp from './components/DguideWalksApp'
import MenuItemWithDialog from './components/LeftMenuBar/MenuList/MenuItemWithDialog'
import './style/index.css'
import {
  DguidewalksContext,
  DguidewalksProvider,
} from './JSDC/Dguidewalks/Context'
import Checkin from './components/Icons/Checkin'
import ConfigProvider from './JSDC/Dguidewalks/ConfigProvider'

// 這個 demo 同時是「下游 App.tsx 遷移後應該長什麼樣」的範本：
// 只有設定與線圖層樣式。景點的 icon、點擊開集章卡片、cluster、集章 key、
// `?id=` 深連結、列表的定位與導航都由 jsdc-dui 內建，要調整時傳 `sceneConfig`。

const EVENT_ID = 'n0004'

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
  menuSwitchItems: [{ id: '數位集章', name: '數位集章' }],
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

function App() {
  const { Jsdc } = useContext(JSDCContext)
  const dui = useContext(DuiContext)
  const { dgw } = useContext(DguidewalksContext)

  const init = () => {
    Jsdc.Controller.get('Layer')
      .getByName<GeoJSON>(`${EVENT_ID}-line`)
      ?.forEachLayerAsGeoJSON<any, LayerApiRespVectorProps>(
        (layer, properties) =>
          layer.setStyle({ color: getRouteColorByType(properties.type) }),
      )
  }

  useEffect(() => {
    ;(window as any).JSDC = Jsdc
    return dgw.gisDataLoadEvent.addEventListener(init)
  }, [])

  return (
    <DguideWalksApp
      mainMenuChildren={
        <MenuItemWithDialog
          Icon={Checkin}
          title="數位集章"
          active={dui.activeMenuId === '數位集章'}
          {...dui.menuSwitcherAction('數位集章')}
        >
          {dui.activeMenuId === '數位集章' && (
            <iframe
              title="數位集章"
              style={{ height: '100%', border: 0, borderRadius: '5px' }}
              src={`https://map.jsdc.com.tw/tools/checkin/${EVENT_ID}/showlist.php?a=${EVENT_ID}`}
            ></iframe>
          )}
        </MenuItemWithDialog>
      }
    />
  )
}

const config = new ConfigProvider({ eventId: EVENT_ID })

const AppWrapper = () => {
  const [Jsdc] = useState(
    new JSDC(EVENT_ID, {
      // n0004 walk 回應的 bbox
      bound: latLngBounds(latLng(24.8426, 121.2727), latLng(24.8863, 121.2868)),
      maxZoom: 19,
    }),
  )
  return (
    <JSDCProvider Jsdc={Jsdc}>
      <DguidewalksProvider
        Jsdc={Jsdc}
        layersHiddenFromUI={[`${EVENT_ID}-line`]}
        layersShowOnMapByDefault={[
          '臺灣通用電子地圖(灰階)',
          `${EVENT_ID}-line`,
        ]}
        config={config}
      >
        <DuiContextProvider
          {...duiConfigProps}
          sceneConfig={{
            checkinKanbanImgSrc: duiConfigProps.headerMBImgSrc,
            // 以下都是預設值，列出來只是示範可以調什麼
            // cluster: true,
            // validDistance: 100,
            // targetZoom: 18.5,
            // onSceneClick: (marker, openDefault) => openDefault(),
          }}
          // 列表的定位、導航鈕也能覆寫；參數是景點 feature（id、properties、geometry），不是 title
          // onSceneTargetClick={(feature) => console.log(feature.id, feature.geometry)}
          // onSceneNavigate={(feature) => console.log(feature.properties.title)}
        >
          <App />
        </DuiContextProvider>
      </DguidewalksProvider>
    </JSDCProvider>
  )
}

ReactDOMClient.createRoot(document.getElementById('root') as Element).render(
  <AppWrapper />,
)

reportWebVitals()
