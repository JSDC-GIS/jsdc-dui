export type ConfigProviderOptions = {
  baseApiUrl?: string
  sceneApiUrl?: string
  eventId: string
  cmsPath?: string[]
  gisSceneLayerNames?: string[]
}

export default class ConfigProvider {
  readonly baseApiUrl: string
  /** 景點（Strapi）API 的 base，結尾帶 `/`，與 `baseApiUrl` 同一慣例。 */
  readonly sceneApiUrl: string
  readonly eventId: string
  readonly cmsPath?: string[]
  /**
   * GIS 後端裡「景點用」的 point 圖層名稱。景點已改由 Strapi 提供，
   * 這些圖層不會被建立；其他 point 圖層（非景點用途）照舊。
   */
  readonly gisSceneLayerNames: string[]
  constructor(options: ConfigProviderOptions) {
    this.baseApiUrl =
      options.baseApiUrl ||
      'https://map.jsdc.com.tw/webgis/backend/dguidewalks/api/'
    this.sceneApiUrl =
      options.sceneApiUrl ||
      'https://trfc-test.mapelon.com/dguidedwalks.tw/api/map/'
    this.eventId = options.eventId
    this.cmsPath = options.cmsPath
    this.gisSceneLayerNames = options.gisSceneLayerNames || [
      `${options.eventId}-point`,
    ]
  }
}
