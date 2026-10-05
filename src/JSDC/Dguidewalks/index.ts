import JSDCLayer from '../Layer/JSDCLayer'
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer'
import { omit } from 'lodash'
import ApiProvider, { SceneFeature, WalkResponse } from './ApiProvider'
import ConfigProvider from './ConfigProvider'
import createTileLayer from './createLayer/createTileLayer'
import createGeoJSONLayer from './createLayer/createGeoJSONLayer'
import { CommonProps } from './createLayer/types'
import Event from '../utils/Event'
import StrapiArticleParser from './proxyParser/StrapiArticleParser'
import { IArticleProxyParser } from './proxyParser/@types'
import {
  SceneMarker,
  createSceneLayer,
  findSceneById,
  findSceneByTitle,
  getSceneMarkers,
} from './scene'

export type {
  SceneCategory,
  SceneFeature,
  SceneProperties,
  WalkResponse,
} from './ApiProvider'
export {
  SCENE_LAYER_NAME,
  DEFAULT_SCENE_VALID_DISTANCE,
  getSceneCheckinName,
  getSceneCheckinKey,
  getSceneCheckinSrc,
  getSceneLatLng,
  getSceneShareUrl,
  getSceneValidDistance,
  isSceneDebugMode,
} from './scene'
export { default as StrapiArticleParser } from './proxyParser/StrapiArticleParser'
export type { SceneMarker } from './scene'

export type DguidewalksOptions = {
  config: ConfigProvider
  layerNameOrder?: string[]
  /** 景點文章來源。不傳就用內建的 Strapi 來源（與景點圖層共用同一次 walk 請求）。 */
  articleParser?: IArticleProxyParser
}

export default class Dguidewalks {
  config: ConfigProvider
  api: ApiProvider
  layerNameOrder: string[]
  gisDataLoadEvent = new Event()
  articleProxyParser: IArticleProxyParser
  /** 景點圖層（Strapi）。載入前、或景點 API 失敗時為 undefined。 */
  sceneLayer: JSDCGeoJSONLayer | undefined
  /** `/walks/{eventId}` 的回應原樣。載入前、或景點 API 失敗時為 undefined。 */
  walk: WalkResponse | undefined
  private walkPromise: Promise<WalkResponse> | undefined
  constructor(options: DguidewalksOptions) {
    this.config = options.config
    this.api = new ApiProvider(this.config)
    this.layerNameOrder = options.layerNameOrder || []
    this.articleProxyParser =
      options.articleParser ??
      new StrapiArticleParser({ loadWalk: () => this.loadWalk() })
  }

  get eventId() {
    return this.config.eventId
  }

  get baseApiUrl() {
    return this.config.baseApiUrl
  }

  get configProvider() {
    return this.config
  }

  get apiProvider() {
    return this.api
  }

  async loadGisData() {
    const api = this.apiProvider
    const [respJson, basemapsJson, sceneLayer] = await Promise.all([
      api.getLayers(),
      api.getBasemaps(),
      this.loadSceneLayer(),
    ])
    const { gisSceneLayerNames } = this.config
    const results: Array<JSDCLayer> = []

    respJson.forEach((layerJson) => {
      const commonProps: CommonProps = omit(layerJson, [
        'Basemap',
        'LineFeatures',
        'PointFeatures',
        'PolygonFeatures',
      ])
      const { LineFeatures, PointFeatures, PolygonFeatures, Basemap, type } =
        layerJson
      const isLineFeatures = LineFeatures.length > 0 && type === 'line'
      // 景點改由 Strapi 提供，GIS 裡景點用的 point 圖層不建；其他 point 圖層照舊
      const isPointFeatures =
        PointFeatures.length > 0 &&
        type === 'point' &&
        !gisSceneLayerNames.includes(layerJson.name)
      const isPolygonFeatures = PolygonFeatures.length > 0 && type === 'polygon'

      isLineFeatures &&
        results.push(createGeoJSONLayer(LineFeatures, commonProps))
      isPointFeatures &&
        results.push(createGeoJSONLayer(PointFeatures, commonProps))
      isPolygonFeatures &&
        results.push(createGeoJSONLayer(PolygonFeatures, commonProps))
    })
    sceneLayer && results.push(sceneLayer)
    basemapsJson.forEach((basemap) =>
      results.push(createTileLayer(basemap.name, basemap.url)),
    )
    return [...results]
  }

  /**
   * 載入 walk，整個生命週期只打一次 `/walks/{eventId}`：
   * 景點圖層與景點文章都從這裡拿，誰先呼叫都共用同一個 promise。
   * 失敗時 promise 會 reject，錯誤在這裡統一記錄一次。
   */
  loadWalk() {
    if (!this.walkPromise) {
      this.walkPromise = this.api.getWalk().then((walk) => {
        this.walk = walk
        return walk
      })
      this.walkPromise.catch((error) =>
        console.error('[scene api]: failed to load scenes', error),
      )
    }
    return this.walkPromise
  }

  // 景點 API 失敗不能拖垮整張地圖：回傳 undefined，
  // 線、面圖層與底圖照常載入，只是沒有景點圖層。
  private async loadSceneLayer() {
    this.sceneLayer = undefined
    try {
      const walk = await this.loadWalk()
      this.sceneLayer = createSceneLayer(walk.pois.features)
    } catch (error) {
      // 已在 loadWalk 記錄
    }
    return this.sceneLayer
  }

  // 給下游用寫死的名稱找景點（例如點 polygon 開對應景點）；jsdc-dui 內部一律用 id / feature。
  findSceneByTitle(title: string): SceneMarker | undefined {
    return findSceneByTitle(getSceneMarkers(this.sceneLayer), title)
  }

  findSceneById(id: string): SceneMarker | undefined {
    return findSceneById(getSceneMarkers(this.sceneLayer), id)
  }

  async getSceneArticles(language?: string) {
    return await this.articleProxyParser.getAll(undefined, language)
  }

  /**
   * 由景點 feature 取內文。景點文字與點位是同一份資料，直接讀 feature，
   * 不用 title 繞回去比對（title 相同或互相包含的景點會配錯）。
   */
  async getSceneDetailArticle(feature: SceneFeature, language?: string) {
    const parser = this.articleProxyParser
    parser.setLanguage(language)
    return await parser.getDetailByFeature(feature)
  }
}
