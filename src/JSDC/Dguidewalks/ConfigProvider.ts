
export type ConfigProviderOptions = {
  baseApiUrl?: string,
  eventId: string
}

export default class ConfigProvider {
  readonly baseApiUrl: string
  readonly eventId: string
  constructor (options: ConfigProviderOptions) {
    this.baseApiUrl = options.baseApiUrl = 'https://map.jsdc.com.tw/webgis/backend/dguidewalks/api/'
    this.eventId = options.eventId
  }
}
