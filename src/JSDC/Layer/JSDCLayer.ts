import { Feature, GeoJsonProperties } from 'geojson'
import Event from '../utils/Event'
import { Layer, Map, FeatureGroup, TileLayer, GeoJSON } from 'leaflet'
import JSDCLayerBehavior, { JSDCLayerDescription } from './JSDCLayerBehavior'

export interface JSDCLayerConstructorOptions extends Pick<JSDCLayerBehavior, 'id' | 'description'> {

}

type ValidationParam = {
  strictMode?: boolean
}

interface FeatureLayer<O> extends Layer {
  feature: Feature<any, O>
}

class JSDCLayer<P extends Layer = Layer> implements JSDCLayerBehavior<P>{
  private _show = false
  private _viewer: Map | undefined
  instance: P | undefined
  description: JSDCLayerDescription
  id: string
  onToggleShowEvent = new Event()
  constructor (options: JSDCLayerConstructorOptions) {
    this.id = options.id
    this.description = options.description
  }

  get show () {
    const _viewer = this.getPrivateViewer()
    if (!_viewer) {
      return this._show
    } else {
      return _viewer.hasLayer(this.instance!)
    }
  }

  set show (val: boolean) {
    const _viewer = this.getPrivateViewer()
    this._show = val
    if (!_viewer || !this.instance) return
    if (val) {
      _viewer.hasLayer(this.instance) || this.instance.addTo(_viewer)
    } else {
      _viewer.removeLayer(this.instance)
    }
    this.onToggleShowEvent.raise()
  }

  isInstanceType<T> (type: T | any, validOptions: ValidationParam = {}): JSDCLayer<P> & { instance: T; } | false {
    const jsdcLayer = this.isInstanceExist(validOptions)
    if (this.instance instanceof type) {
      return jsdcLayer as JSDCLayer<P> & { instance: T; }
    } else {
      return false
    }
  }

  isTileLayer (validOptions: ValidationParam = {}) {
    return this.isInstanceType<TileLayer>(TileLayer, validOptions)
  }

  isGeoJSON (validOptions: ValidationParam = {}) {
    return this.isInstanceType<GeoJSON>(GeoJSON, validOptions)
  }

  setOpacity(opacity: number) {
    const tileLayer = this.isTileLayer()
    if (!tileLayer) {
      console.warn('layer is not TileLayer type, it can not set opacity')
      return
    }
    tileLayer.instance.setOpacity(opacity)
  }

  addToMap(viewer: Map) {
    this._viewer = viewer
    viewer.addLayer(this.instance!)
  }

  isInstanceExist ({ strictMode = false }: ValidationParam = {}) {
    if (!this.instance) {
      if (!strictMode) return false
      throw new Error('JSDCLayer\'s instance is not set yet')
    }
    return this as JSDCLayer<P> & { instance: Layer }
  }

  isInstanceExistStrict () {
    if (!this.instance) throw new Error('JSDCLayer\'s instance is not set yet')
    return this as JSDCLayer<P> & { instance: Layer }
  }

  setInstance(instance: P | undefined) {
    this.instance = instance
  }
  
  getPrivateViewer () {
    const leafletPrivateMap = (this.instance as any)._map as Map | undefined
    this._viewer = leafletPrivateMap ? leafletPrivateMap : this._viewer
    return this._viewer
  }

  forEachLayerAsGeoJSON<L, O = GeoJsonProperties>(eachLayer: (layer: L, props: O) => void = () => null) {
    const jsdcLayer = this.isGeoJSON({ strictMode: true })
    if (!jsdcLayer) {
      console.log('fuck')
      return
    }
    const layers = jsdcLayer.instance.getLayers() as Array<L & FeatureLayer<O>>
    
    layers.forEach((layer) => {
      const { properties } = layer.feature
      eachLayer(layer, properties)
    })
  }
}

export default JSDCLayer
