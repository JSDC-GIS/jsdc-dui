import * as ReactDOMClient from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import React, { useContext, useEffect, useState } from 'react'
import { JSDCContext, JSDCProvider } from './JSDC/Context'
import JSDC from './JSDC'
import './i18n/config'
import { latLng, latLngBounds } from 'leaflet'
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

// 這個 demo 同時是「下游 App.tsx 遷移後應該長什麼樣」的範本：只剩設定。
// 底圖、線、面的顏色、popup、預設顯示與圖層清單都來自 Strapi 的 `mapConfig`，
// 路線顏色選單內建（`pathColorConfig`）；景點的 icon、點擊開集章卡片、cluster、集章 key、
// `?id=` 深連結、列表的定位與導航也由 jsdc-dui 內建，要調整時傳 `sceneConfig`。
// 主視覺、手機版橫幅、路線介紹的圖、分頁圖示跟著 Strapi 的 `viewerAssets`，圖例說明亮起來的
// 類別跟著 `categories`；這裡傳的三張圖只是 Strapi 還沒有圖時的 fallback。
// 需要額外行為（例如點面開景點）時，才監聽 `dgw.dataLoadEvent` 用
// `Jsdc.Controller.get('Layer').getByName(圖層名稱)` 取圖層。

const DEFAULT_EVENT_ID = 'n0004'
// demo 專用：`?eventId=n0028` 切換專案，方便用不同資料驗證。下游專案的代碼是寫死的。
const EVENT_ID =
  new URLSearchParams(window.location.search).get('eventId') || DEFAULT_EVENT_ID

const duiConfigProps: IDuiContextProviderProps = {
  sidebarTitle: '標題1',
  sidebarSubtitle: '標題2',
  // 三張圖都是選填的 fallback：`viewerAssets` 對應欄位有值時用 Strapi 的，沒有值
  // （含 /walks 回來之前）才用這裡的。Strapi 的圖補齊後，下游可以整個不傳、把圖檔刪掉。
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
  // legendConfig 不用傳：圖例說明亮起來的類別跟著 Strapi 的 categories。
  // 要自訂才傳 `legendConfig: { activeLegends: ['歷史建物', '聚落'] }`，要整個隱藏傳 `{ disabled: true }`。
  themeConfig: {
    '--dui-primary': '#EB9D1D',
    '--dui-accent': '#C95843',
    '--dui-secondary': '#EB9D1D',
    '--dui-bg-secondary': '#EB9D1D',
    '--dui-bg-accent': '#EB9D1D',
  },
}

function App() {
  const { Jsdc } = useContext(JSDCContext)
  const dui = useContext(DuiContext)
  const { dgw } = useContext(DguidewalksContext)

  useEffect(() => {
    ;(window as any).JSDC = Jsdc
    // demo 專用：切到別的專案時沒有寫死的範圍，資料載完後移到 walk 回應的 bbox
    return dgw.dataLoadEvent.addEventListener(() => {
      if (EVENT_ID === DEFAULT_EVENT_ID || !dgw.walk) return
      const [west, south, east, north] = dgw.walk.bbox
      const bound = latLngBounds(latLng(south, west), latLng(north, east))
      Jsdc.mapOption.bound = bound
      Jsdc.viewer?.fitBounds(bound)
    })
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
      bound:
        EVENT_ID === DEFAULT_EVENT_ID
          ? latLngBounds(latLng(24.8426, 121.2727), latLng(24.8863, 121.2868))
          : undefined,
      maxZoom: 19,
    }),
  )
  return (
    <JSDCProvider Jsdc={Jsdc}>
      <DguidewalksProvider Jsdc={Jsdc} config={config}>
        <DuiContextProvider
          {...duiConfigProps}
          // 路線顏色選單預設不顯示，要顯示的專案明確開啟
          pathColorConfig={{ enabled: true }}
          sceneConfig={
            {
              // 集章對話框上方的圖預設就是手機版橫幅（viewerAssets.headerMobile ?? headerMBImgSrc）；
              // 要用另一張圖才傳：
              // checkinKanbanImgSrc: kanbanImg,
              // 以下都是預設值，列出來只是示範可以調什麼
              // cluster: true,
              // validDistance: 100,
              // targetZoom: 18.5,
              // onSceneClick: (marker, openDefault) => openDefault(),
            }
          }
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
