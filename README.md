<h1 align="center">JSDC DUI</h1>

---


## Installation

```
// Install from git repo.
npm install https://github.com/60723005l/jsdc-dui.git
// to install a tag version named 0.3.1
npm install https://github.com/60723005l/jsdc-dui.git#0.3.1

// Install from npm
npm i jsdc-dui
```

## Usage

Components should be imported from `jsdc-dui/dist/components/...`

example
```tsx
import React, { useContext, useEffect, useState } from 'react'
import { JSDCContext, JSDCProvider } from 'jsdc-dui/dist/JSDC/Context'
import JSDC from 'jsdc-dui/dist/JSDC'
import { LayerApiRespVectorProps } from 'jsdc-dui/dist/JSDC/Dguidewalks/ApiProvider'
import Leaflet, { GeoJSON, Marker } from 'leaflet'
import { IDuiContextProviderProps, DuiContext, DuiContextProvider } from 'jsdc-dui/dist/components/Context'
import DguideWalksApp from 'jsdc-dui/dist/components/DguideWalksApp'
import Dialog from 'jsdc-dui/dist/components/Dialog'
import MenuItemWithDialog from 'jsdc-dui/dist/components/LeftMenuBar/MenuList/MenuItemWithDialog'
import { DguidewalksContext, DguidewalksProvider } from 'jsdc-dui/dist/JSDC/Dguidewalks/Context'
import icon, { baseUrl } from 'jsdc-dui/dist/icon'
import 'jsdc-dui/dist/style/index.css'

// project configuration
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

// your function to customize layer style
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

// your function to customize layer style
const getPOIIcon = (type: string) => {
  return Leaflet.icon({ iconUrl: `${baseUrl}map_icons/type${type}.png`, iconSize: [30, 40] })
}

function App() {
  const { Jsdc } = useContext(JSDCContext)
  const dui = useContext(DuiContext)
  const { dgw } = useContext(DguidewalksContext)

  // custom states for layer onclick popup
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
  )
}

const AppWrapper: React.FC = () => {
  const [Jsdc] = useState(new JSDC('s0002'))
  return (
    <JSDCProvider Jsdc={Jsdc}>
      <DguidewalksProvider
        Jsdc={Jsdc}
        activeBasemaps={['臺灣通用電子地圖(灰階)', '正射影像圖(通用)', '嘉南大圳平圖(1933)', '臺灣經建1版地形圖']}
        layersHiddenFromUI={['浸水營古道數位走讀示範景點', '浸水營古道數位走讀示範路線']}
        layersShowOnMapByDefault={['臺灣通用電子地圖(灰階)', '浸水營古道數位走讀示範景點', '浸水營古道數位走讀示範路線']}>
        <DuiContextProvider {...duiConfigProps}>
          <App/>
        </DuiContextProvider>
      </DguidewalksProvider>
    </JSDCProvider>
  )
}

export default AppWrapper

// ======================

ReactDOMClient.createRoot(document.getElementById('root') as Element)
  .render(
    <AppWrapper />
  )

reportWebVitals();
```

#### ThemeConfig
```ts
const defaultTheme = {
  '--dui-primary': 'rgb(0, 102, 255)',
  '--dui-secondary': 'rgb(42, 125, 250)',
  '--dui-accent': 'red',
  '--dui-bg-primary': 'white',
  '--dui-bg-secondary': 'rgb(42, 125, 250)',
  // 畫面那一圈外匡顏色
  '--dui-bg-accent': '#F1C385',
  '--dui-text-primary': '#1f1f1f',
  '--dui-text-gray': '#878787'
}
```

#### ICONS
Icons can be imported from `jsdc-dui/dist/icon`.
All icons return src value, those icon assets was host by jsdc server.

```tsx
import icon from 'jsdc-dui/dist/icon'

//activable icons
icon.activable.layer
icon.activable.layerActive

//legend icons
icon.legend.人文地景.default
icon.legend.人文地景.active

//credit icons
icon.credit.qrcode

const App = () => {
  return <img src={icon.activable.layer} />
}
```
