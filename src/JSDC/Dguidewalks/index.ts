import JSDCLayer from "../Layer/JSDCLayer"
import { omit } from "lodash"
import ApiProvider from "./ApiProvider"
import ConfigProvider from "./ConfigProvider"
import createTileLayer from "./createLayer/createTileLayer"
import createGeoJSONLayer from "./createLayer/createGeoJSONLayer"
import { CommonProps } from "./createLayer/types"
import Event from "../utils/Event"
import ArticleProxyParser from "./proxyParser"
import { IArticleProxyParser } from "./proxyParser/@types"

export type DguidewalksOptions = {
  config: ConfigProvider,
  layerNameOrder?: string[]
  articleParser: IArticleProxyParser
}

export default class Dguidewalks {
  config: ConfigProvider
  api: ApiProvider
  layerNameOrder: string[]
  gisDataLoadEvent = new Event()
  articleProxyParser: IArticleProxyParser
  constructor (options: DguidewalksOptions) {
    this.config = options.config
    this.api = new ApiProvider(this.config)
    this.layerNameOrder = options.layerNameOrder || []
    this.articleProxyParser = options.articleParser
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
      const commonProps: CommonProps = omit(layerJson, ['Basemap', 'LineFeatures', 'PointFeatures', 'PolygonFeatures'])
      const { LineFeatures, PointFeatures, PolygonFeatures, Basemap, type } = layerJson
      const isLineFeatures = LineFeatures.length > 0 && type === 'line'
      const isPointFeatures = PointFeatures.length > 0 && type === 'point'
      const isPolygonFeatures = PolygonFeatures.length > 0 && type === 'polygon'
      const isBasemap = Basemap && type === 'image'

      isLineFeatures && results.push(createGeoJSONLayer(LineFeatures, commonProps))
      isPointFeatures && results.push(createGeoJSONLayer(PointFeatures, commonProps))
      isPolygonFeatures && results.push(createGeoJSONLayer(PolygonFeatures, commonProps))
      isBasemap && results.push(createTileLayer(layerJson.name, Basemap?.url || 'url_not_fount'))
    })
    return [...results]
  }

  async getSceneArticles () {
    return await this.articleProxyParser.getAll()
  }

  async getSceneDetailArticleByTitle (title: string, fallbackUrl?: string | null) {
    return await this.articleProxyParser.getDetailByTitle(title, fallbackUrl)
  }
}