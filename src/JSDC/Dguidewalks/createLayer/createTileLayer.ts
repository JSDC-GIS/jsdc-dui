import JSDCLayer from "../..//Layer/JSDCLayer";
import { TileLayer } from "leaflet";
import { uniqueId } from "lodash";

const createTileLayer =  (name: string, url: string) => {
  const instance = new TileLayer(url)
  const layer = new JSDCLayer(
    {
      id: `${name}_${uniqueId('basemap')}`,
      description: {
        name: name,
        type: 'image'
      }
    }
  )
  layer.setInstance(instance)
  return layer
}

export default createTileLayer
