import JSDCLayer from "../Layer/JSDCLayer"
import { omit } from "lodash"
import ApiProvider from "./ApiProvider"
import BasemapProvider from "./BasemapProvider"
import ConfigProvider from "./ConfigProvider"
import createTileLayer from "./createLayer/createTileLayer"
import createGeoJSONLayer from "./createLayer/createGeoJSONLayer"
import { CommonProps } from "./createLayer/types"
import Event from "../utils/Event"

export type DguidewalksOptions = {
  config: ConfigProvider,
  basemap: BasemapProvider
}

export default class Dguidewalks {
  config: ConfigProvider
  basemap: BasemapProvider
  api: ApiProvider
  gisDataLoadEvent = new Event()
  constructor (options: DguidewalksOptions) {
    this.config = options.config
    this.basemap = options.basemap
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

  loadBasemap () {
    const basemapAssets = this.basemap.listAll()
    return basemapAssets.map(({ name, url }) => createTileLayer(name, url))
  }

  async loadGisData () {
    const api = this.apiProvider
    const respJson = await api.getLayers()
    const results: Array<JSDCLayer> = []

    respJson.forEach(layerJson => {
      const commonProps: CommonProps = omit(layerJson, ['Basemap', 'LineFeatures', 'PointFeatures', 'PolygonFeatures'])
      const { LineFeatures, PointFeatures, PolygonFeatures, type } = layerJson
      const isLineFeatures = LineFeatures.length > 0 && type === 'line'
      const isPointFeatures = PointFeatures.length > 0 && type === 'point'
      const isPolygonFeatures = PolygonFeatures.length > 0 && type === 'polygon'

      isLineFeatures && results.push(createGeoJSONLayer(LineFeatures, commonProps))
      isPointFeatures && results.push(createGeoJSONLayer(PointFeatures, commonProps))
      isPolygonFeatures && results.push(createGeoJSONLayer(PolygonFeatures, commonProps))
    })
    return [...results, ...this.loadBasemap()]
  }
}