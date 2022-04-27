import JSDCLayer from "../Layer/JSDCLayer"
import { omit, result } from "lodash"
import ApiProvider from "./ApiProvider"
import BasemapProvider from "./BasemapProvider"
import ConfigProvider from "./ConfigProvider"
import createTileLayer from "./createLayer/createTileLayer"
import createGeoJSONLayer from "./createLayer/createGeoJSONLayer"
import { CommonProps } from "./createLayer/types"
import Event from "../utils/Event"

export type DguidewalksOptions = {
  config: ConfigProvider
}

export default class Dguidewalks {
  config: ConfigProvider
  api: ApiProvider
  gisDataLoadEvent = new Event()
  constructor (options: DguidewalksOptions) {
    this.config = options.config
    this.api = new ApiProvider(this.config)
  }

  get eventId () {
    return this.config.eventId
  }

  get baseApiUrl () {
    return this.config.baseApiUrl
  }

  get configProvider () {
    return this.config
  }

  get apiProvider () {
    return this.api
  }

  async loadGisData () {
    const api = this.apiProvider
    const respJson = await api.getLayers()
    const results: Array<JSDCLayer> = []

    respJson.forEach(layerJson => {
      const commonProps: CommonProps = omit(layerJson, ['Basemaps', 'LineFeatures', 'PointFeatures', 'PolygonFeatures'])
      const { LineFeatures, PointFeatures, PolygonFeatures, Basemaps, type } = layerJson
      const isLineFeatures = LineFeatures.length > 0 && type === 'line'
      const isPointFeatures = PointFeatures.length > 0 && type === 'point'
      const isPolygonFeatures = PolygonFeatures.length > 0 && type === 'polygon'
      const isBasemaps = Basemaps && type === 'image'

      isLineFeatures && results.push(createGeoJSONLayer(LineFeatures, commonProps))
      isPointFeatures && results.push(createGeoJSONLayer(PointFeatures, commonProps))
      isPolygonFeatures && results.push(createGeoJSONLayer(PolygonFeatures, commonProps))
      isBasemaps && results.push(createTileLayer(layerJson.name, <string>Basemaps?.url))
    })
    return [...results]
  }
}