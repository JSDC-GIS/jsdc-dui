import JSDCLayer from '../Layer/JSDCLayer'
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer'
import ApiProvider, {
  SceneFeature,
  WalkGeoJSONLayer,
  WalkMapLayer,
  WalkResponse,
  WalkTileLayer,
  isWalkGeoJSONLayer,
} from './ApiProvider'
import ConfigProvider from './ConfigProvider'
import createTileLayer from './createLayer/createTileLayer'
import createGeoJSONLayer from './createLayer/createGeoJSONLayer'
import { GeoJSONOverlayLayer, getPathColorItems } from './mapLayers'
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
  WalkGeoJSONLayer,
  WalkGeoJSONStyleBy,
  WalkMapConfig,
  WalkMapLayer,
  WalkResponse,
  WalkTileLayer,
  WalkViewerAssets,
} from './ApiProvider'
export { isWalkGeoJSONLayer, isWalkTileLayer } from './ApiProvider'
export type { GeoJSONOverlayLayer, PathColorItem } from './mapLayers'
export {
  VIEWER_MANIFEST_ATTRIBUTE,
  applyViewerHeadIcons,
  applyViewerManifest,
  buildViewerManifest,
  getLegendNamesFromCategories,
  pickViewerImageAssets,
  resolveViewerManifestIcons,
  resolveViewerHeadIcons,
  resolveViewerImages,
} from './viewerAssets'
export type {
  ViewerHeadIcons,
  ViewerImageAssets,
  ViewerImageFallbacks,
  ViewerManifestIcon,
  ViewerImages,
} from './viewerAssets'
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
  /** 底圖、線、面、景點圖層都建好並加到地圖後發出。 */
  dataLoadEvent = new Event()
  articleProxyParser: IArticleProxyParser
  /** 景點圖層（Strapi）。載入前、或景點 API 失敗時為 undefined。 */
  sceneLayer: JSDCGeoJSONLayer | undefined
  /** `/walks/{eventId}` 的回應原樣。載入前、或景點 API 失敗時為 undefined。 */
  walk: WalkResponse | undefined
  /** `mapConfig.overlays` 裡已載入的 `geojson` 疊圖（線、面），照陣列順序。 */
  geoJSONOverlayLayers: GeoJSONOverlayLayer[] = []
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

  /** @deprecated 改用 `dataLoadEvent`（同一個事件物件）。 */
  get gisDataLoadEvent() {
    return this.dataLoadEvent
  }

  get configProvider() {
    return this.config
  }

  get apiProvider() {
    return this.api
  }

  /**
   * 建立地圖要用的全部圖層，資料都來自同一次 `/walks/{eventId}`（外加各 GeoJSON 檔）：
   * `mapConfig.baseLayers` 的圖磚 → `mapConfig.overlays`（圖磚與線、面，照陣列順序）→ 景點圖層。
   * 圖層預設是否顯示、是否列在圖層清單寫在 `description.visible` / `description.listed`。
   * `mapConfig` 是內容端手動維護的 JSON：填錯的項目 `console.warn` 後略過，
   * 不會 reject，也不影響其他圖層與景點。
   */
  async loadMapData() {
    const sceneLayer = await this.loadSceneLayer()
    const results: Array<JSDCLayer> = []
    try {
      results.push(...(await this.loadMapConfigLayers()))
    } catch (error) {
      console.error('[map config]: failed to build map layers', error)
    }
    sceneLayer && results.push(sceneLayer)
    return results
  }

  /** @deprecated 改用 `loadMapData()`。 */
  loadGisData() {
    return this.loadMapData()
  }

  private async loadMapConfigLayers() {
    const mapConfig = this.walk?.mapConfig
    const baseLayers = this.getMapConfigItems(
      mapConfig?.baseLayers,
      'baseLayers',
    )
    const overlays = this.getMapConfigItems(mapConfig?.overlays, 'overlays')
    const geojsonOverlays = overlays
      .filter(isWalkGeoJSONLayer)
      .filter((item) => this.isCompleteLayer(item, 'geojson overlay'))
    const geojsonLayers = await this.loadGeoJSONLayers(geojsonOverlays)
    const results: Array<JSDCLayer> = []

    const tiles = baseLayers.filter(
      (item) =>
        !isWalkGeoJSONLayer(item) && this.isCompleteLayer(item, 'tile layer'),
    )
    const defaultTile = this.pickDefaultBaseLayer(tiles)
    tiles.forEach((item) =>
      results.push(this.createTileLayer(item, item === defaultTile)),
    )
    overlays.forEach((item) => {
      if (isWalkGeoJSONLayer(item)) {
        const layer = geojsonLayers[geojsonOverlays.indexOf(item)]
        layer && results.push(layer)
        return
      }
      // 只有 baseLayers 的 `default` 算數，疊圖圖磚一律預設不顯示
      this.isCompleteLayer(item, 'tile layer') &&
        results.push(this.createTileLayer(item, false))
    })
    return results
  }

  // baseLayers / overlays 不是陣列、或裡面有不是物件的項目時，略過並警告
  private getMapConfigItems(value: unknown, key: string): WalkMapLayer[] {
    if (value === undefined || value === null) return []
    if (!Array.isArray(value)) {
      console.warn(`[map config]: "${key}" is not an array, ignored`, value)
      return []
    }
    return value.filter((item) => {
      const valid = !!item && typeof item === 'object'
      valid || console.warn(`[map config]: invalid item in "${key}"`, item)
      return valid
    })
  }

  // 規格外的欄位一律不讀；缺 name / url 的項目建不出圖層（清單會多一列空白），略過
  private isCompleteLayer(item: WalkMapLayer, kind: string) {
    const complete =
      typeof item.name === 'string' &&
      item.name !== '' &&
      typeof item.url === 'string' &&
      item.url !== ''
    complete || console.warn(`[map config]: ${kind} without name or url`, item)
    return complete
  }

  // 預設底圖：`default: true` 的那一筆。沒有任何一筆時退回第一個底圖（否則整張圖沒有底圖），
  // 有多筆時只取第一筆。
  private pickDefaultBaseLayer(tiles: WalkMapLayer[]) {
    if (tiles.length === 0) return undefined
    const defaults = tiles.filter(
      (item) => (item as WalkTileLayer).default === true,
    )
    if (defaults.length === 0) {
      console.warn(
        `[map config]: no base layer has "default: true", using "${tiles[0].name}"`,
      )
      return tiles[0]
    }
    if (defaults.length > 1) {
      console.warn(
        `[map config]: ${defaults.length} base layers have "default: true", using "${defaults[0].name}"`,
        defaults.slice(1).map((item) => item.name),
      )
    }
    return defaults[0]
  }

  private createTileLayer(item: WalkMapLayer, visible: boolean) {
    const { name, url, attribution, nameEn } = item as WalkTileLayer
    return createTileLayer(name, url, { attribution, nameEn, visible })
  }

  // 平行抓各個 GeoJSON 檔，回傳與 overlays 同順序的圖層。
  // 單一檔案失敗只略過那個圖層（該位置是 undefined），其他圖層照常載入。
  private async loadGeoJSONLayers(overlays: WalkGeoJSONLayer[]) {
    const layers = await Promise.all(
      overlays.map(async (overlay) => {
        try {
          const geojson = await this.api.getGeoJSON(overlay.url)
          return createGeoJSONLayer(overlay, geojson)
        } catch (error) {
          console.warn(
            `[map data]: failed to load layer "${overlay.name}", skipped`,
            error,
          )
          return undefined
        }
      }),
    )
    const loaded: GeoJSONOverlayLayer[] = []
    overlays.forEach((overlay, index) => {
      const layer = layers[index]
      layer && loaded.push({ overlay, layer })
    })
    this.geoJSONOverlayLayers = loaded
    return layers
  }

  /** 「路線顏色」選單的資料，由已載入的線圖層產生（規則見 `getPathColorItems`）。 */
  getPathColors(language?: string) {
    return getPathColorItems(this.geoJSONOverlayLayers, language)
  }

  /**
   * 載入 walk，整個生命週期只打一次 `/walks/{eventId}`：
   * 底圖、線、面、景點圖層與景點文章都從這裡拿，誰先呼叫都共用同一個 promise。
   * 失敗時 promise 會 reject，錯誤在這裡統一記錄一次。
   */
  loadWalk() {
    if (!this.walkPromise) {
      this.walkPromise = this.api.getWalk().then((walk) => {
        this.walk = walk
        return walk
      })
      this.walkPromise.catch((error) =>
        console.error(
          `[walk api]: failed to load /walks/${this.eventId}; the map will have no base layers, routes, polygons or scenes`,
          error,
        ),
      )
    }
    return this.walkPromise
  }

  // walk 請求失敗時回傳 undefined（不 reject）。
  // 底圖、線、面也來自同一支回應，這時地圖上不會有任何圖層。
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
