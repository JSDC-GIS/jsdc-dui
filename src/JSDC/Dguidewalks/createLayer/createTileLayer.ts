import JSDCLayer from '../..//Layer/JSDCLayer'
import { TileLayer } from 'leaflet'
import { uniqueId } from 'lodash'

export type CreateTileLayerOptions = {
  /** 版權文字，顯示在地圖的 attribution 控制項（只在圖層顯示時出現）。 */
  attribution?: string
  /** 語系是 en 時圖層清單顯示的名稱。 */
  nameEn?: string
  /** 預設是否顯示在地圖上（`mapConfig.baseLayers` 的 `default`）。 */
  visible?: boolean
}

const createTileLayer = (
  name: string,
  url: string,
  options: CreateTileLayerOptions = {},
) => {
  const instance = new TileLayer(url, {
    maxZoom: 20,
    attribution: options.attribution,
  })
  const layer = new JSDCLayer({
    id: `${name}_${uniqueId('basemap')}`,
    description: {
      name: name,
      type: 'image',
      nameEn: options.nameEn,
      visible: options.visible === true,
      listed: true,
    },
  })
  layer.setInstance(instance)
  return layer
}

export default createTileLayer
