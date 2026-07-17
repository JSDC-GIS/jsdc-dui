import { range } from 'lodash'

export const baseUrl = 'https://map.jsdc.com.tw/webgis/dguidewalks/assets/'

// 分類 → 檔名前綴對照表。key 是資料識別碼（中文分類名），順序不可變動。
export const legendFilenames = {
  人文地景: 'icon-l-01',
  歷史建物: 'icon-l-02',
  聚落: 'icon-l-03',
  自然地景: 'icon-l-04',
  田園景色: 'icon-l-05',
  資訊站: 'icon-l-06',
  紀念指標: 'icon-l-07',
  展覽場館: 'icon-l-08',
  水利工程: 'icon-l-09',
  工作站: 'icon-l-10',
  裝置藝術: 'icon-l-11',
  商店: 'icon-l-12',
}

export type LegendName = keyof typeof legendFilenames

export interface ILegendIcon {
  default: string
  active: string
}

// 依 i18next 語系回傳 legend 圖檔 URL。en 走 legends/en/ 子資料夾，
// 檔名與中文版相同；其餘語系（含 zh-TW）走 legends/。
export const getLegend = (lng?: string): Record<LegendName, ILegendIcon> => {
  const dir = lng === 'en' ? 'legends/en' : 'legends'
  return Object.entries(legendFilenames).reduce(
    (obj, [name, file]) => {
      obj[name as LegendName] = {
        default: `${baseUrl}${dir}/${file}-g.svg`,
        active: `${baseUrl}${dir}/${file}.svg`,
      }
      return obj
    },
    {} as Record<LegendName, ILegendIcon>,
  )
}

// 向下相容：預設（zh-TW）的靜態 legend 物件，維持 default export 結構與型別不變。
export const legend = getLegend('zh-TW')

export const counter = range(0, 10).reduce(
  (obj, value) => {
    const key = String(value)
    obj[key] = `${baseUrl}counter/${value}.svg`
    return obj
  },
  {} as { [k: string]: string },
)

export const activable = {
  layer: `${baseUrl}menu_icons/layer.svg`,
  layerActive: `${baseUrl}menu_icons/layer_active.svg`,
  weather: `${baseUrl}menu_icons/weather.svg`,
  weatherActive: `${baseUrl}menu_icons/weather_active.svg`,
  hamburger: `${baseUrl}menu_icons/hamburger.svg`,
  hamburgerActive: `${baseUrl}menu_icons/hamburger_active.svg`,
  info: `${baseUrl}menu_icons/info.svg`,
  infoActive: `${baseUrl}menu_icons/info_active.svg`,
  about: `${baseUrl}menu_icons/about.svg`,
  aboutActive: `${baseUrl}menu_icons/about_active.svg`,
  locationMappin: `${baseUrl}menu_icons/location-mappin.svg`,
  locationMappinActive: `${baseUrl}menu_icons/location-mappin_active.svg`,
}

export const credit = {
  qrcode: `${baseUrl}credit/fb_qrcode.png`,
  logo: `${baseUrl}credit/main-logo.svg`,
}

export const others = {
  processing: `${baseUrl}others/processing.gif`,
}

export default {
  activable,
  legend,
  credit,
  others,
}
