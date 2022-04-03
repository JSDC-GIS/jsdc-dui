<h1 align="center">JSDC RUI</h1>

---


## Installation
JSDC RUI is **not** available as an npm package.
```
npm install https://github.com/60723005l/jsdc-RUI.git

// to install a tag version named 0.3.1
npm install https://github.com/60723005l/jsdc-RUI.git#0.3.1
```

## Usage

Components should be imported from `jsdc-rui/dist/components/...`

example
```tsx
import React from 'react';
import MapViewContainer from 'jsdc-rui/dist/components/MapViewContainer';
import MenuList from 'jsdc-rui/dist/components/LeftMenuBar/MenuList';
import headerMbImg from './testAsset/logo-m.jpg'
import headerBImg from './testAsset/logo-d.jpg'
import useSwitch from 'jsdc-rui/dist/utils/useSwitch';
import LayerMenuItem from 'jsdc-rui/dist/components/LeftMenuBar/Layer/LayerMenuItem';
import WeatherMenuItem from 'jsdc-rui/dist/components/LeftMenuBar/Weather/WeatherMenuItem';

type MenuItemType = {
  id: string,
  name: string
}

function App() {
  const mainMenuItems = [
    { id: '地圖圖層', name: '地圖圖層' },
    { id: '氣象預測', name: '氣象預測' }
  ]
  const { switchById, activeId } = useSwitch<MenuItemType>([...mainMenuItems])
  const switcherAction = (id: string) => {
    return {
      onClick: () => switchById(id),
      onClose: () => switchById(undefined)
    }
  }
  return (
    <MapViewContainer
      headerImgSrc={headerMbImg}
      menuChildren={(
        <MenuList
          title='橫越屏東縣春日鄉和' subtitle='臺東縣大武鄉的浸水營古道'
          headerImg={headerBImg} headerMBImg={headerMbImg}>
          <>
            <LayerMenuItem active={activeId === '地圖圖層'} {...switcherAction('地圖圖層')}/>
            <WeatherMenuItem active={activeId === '氣象預測'} {...switcherAction('氣象預測')}
              locations={[
                { county: '屏東縣', town: '枋寮鄉' },
                { county: '屏東縣', town: '春日鄉' }
              ]}
              token='CWB-232A270E-12F1-4381-B9F2-DF2D2670A077'/>
          </>
        </MenuList>
      )}/>
  );
}

export default App;
```

#### ICONS
Icons can be imported from `jsdc-rui/dist/icon`.
All icons return src value, those icon assets was host by jsdc server.

```tsx
import icon from 'jsdc-rui/dist/icon'

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
