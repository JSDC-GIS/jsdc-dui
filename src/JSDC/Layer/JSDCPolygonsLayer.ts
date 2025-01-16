import { LayerGroup, Polygon, Polyline } from 'leaflet'
import JSDCLayer, { JSDCLayerConstructorOptions } from './JSDCLayer'

class JSDCPolygonsLayer extends JSDCLayer<LayerGroup<Polygon>> {
  constructor(options: JSDCLayerConstructorOptions) {
    super(options)
    this.instance = new LayerGroup<Polygon>()
  }

  addPolygon(polygon: Polygon) {
    this.instance?.addLayer(polygon)
  }
}

export default JSDCPolygonsLayer
