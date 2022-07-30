import { LineString, MultiLineString, MultiPolygon, Point, Polygon } from "geojson"
import ConfigProvider from "./ConfigProvider"

interface LayerApiRespBase {
  updatedAt: string
  createdAt: string
  options: null | {}
  id: string
  layerId: string
}

export interface LayerApiRespVectorProps {
  name: string
  type: string
  url: null | string
  [k: string]: any
}

export interface LayerApiRespVectorType<T = {}> extends LayerApiRespBase, LayerApiRespVectorProps {
  geometry: T
}

export type LayerApiRespLineFeature = LayerApiRespVectorType<LineString | MultiLineString>

export type LayerApiRespPointFeature = LayerApiRespVectorType<Point>

export type LayerApiRespPolygonFeature = LayerApiRespVectorType<Polygon | MultiPolygon>


export interface LayerApiRespBasemap extends LayerApiRespBase {
  url: "https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM50K_1916-jpg-{z}-{x}-{y}"
}


export interface BasemapApiRespItem {
  createdAt: string
  id: number
  name: string
  options: null | {}
  type: "xyz" | string
  updatedAt: string
  url: string
}
export interface LayerApiRespItem {
  Basemap: null | LayerApiRespBasemap
  LineFeatures: LayerApiRespLineFeature[]
  PointFeatures: LayerApiRespPointFeature[]
  PolygonFeatures: LayerApiRespPolygonFeature[]
  createdAt: string
  eventId: string
  id: string
  name: string
  options: null | {}
  type: 'line' | 'point' | 'polygon' | 'image'
  updatedAt: string
}

export interface ApiGetLayerResponse {}

export default class ApiProvider {
  readonly baseUrl: string
  readonly eventId: string
  readonly cmsPath: string
  constructor (configProvider: ConfigProvider) {
    this.baseUrl = configProvider.baseApiUrl
    this.eventId = configProvider.eventId
    this.cmsPath = configProvider.cmsPath || ''
  }

  get layersApiUrl () {
    return `${this.baseUrl}event/${this.eventId}/layers`
  }

  get basemapsUrl () {
    return `${this.baseUrl}event/${this.eventId}/basemaps`
  }

  async getLayers () {
    const url =  this.layersApiUrl
    const resp = await fetch(url)
    return await resp.json() as LayerApiRespItem[]
  }

  async getBasemaps () {
    const url = this.basemapsUrl
    const resp = await fetch(url)
    return await resp.json() as BasemapApiRespItem[]
  }

  get proxyApiUrl () {
    return `${this.baseUrl}jsdc-proxy/`
  }

  getProxyQuery = async (targetUrl: string) => {
    const url = this.proxyApiUrl
    const resp = await fetch(`${url}?proxy=${targetUrl}`)
    return await resp.text() as string
  }
}
