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

// 景點 marker 圖檔。編號直接取 Strapi 的 category.icon（'01'～'12'），
// 檔名編號與它一致，不需要換算；沒有分類或編號無法解析時用 type1。
export const getSceneIconUrl = (category?: { icon: string } | null) => {
  const type = Number(category?.icon)
  return `${baseUrl}map_icons/type${type > 0 ? type : 1}.svg`
}

export const credit = {
  qrcode: `${baseUrl}credit/fb_qrcode.png`,
  logo: `${baseUrl}credit/main-logo.svg`,
}

export const others = {
  processing: `${baseUrl}others/processing.gif`,
  // 景點沒有圖片時的預設圖（55×48 的 PNG，原檔是 public/image-m.png）。
  // rollup 沒有處理圖片檔的 plugin，所以直接內嵌成 data URI，下游不用另外放檔案。
  noImage:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAwCAYAAAC13uL+AAAABHNCSVQICAgIfAhkiAAAA+lJREFUaEPtms1PE1EQwGe2qyEm9qAHEuFAKd1QOBAuciaBKzH1KAlHo/8AHDhqDFdQvELUI5BwMuGAV/DkgZZ0KWBS4lVrglroG+ctbr9oux/92Ifpnpru27fzm5k3b+btIJRdX0yz/xbhHKI2RUD95fdU/o2ASUDc1OlyKxaL5WxZ0f6RymQSJGBJZQgXsuV0Cs0axkBKjrXg/hMwm70IiJYrgrZbrhUi2AegPReaUmIIIiTYTn0ld8RsPDY4icn00SL761zxhgbz8Wh0UwmpPQiRPMosAUnIfxfhc0yZx7t28JAWGzWiTzzMqcxQ0zTDF4Sf2FB3LaEQNjFpZswiLNHKqDG0rIzEHgU5SGc+sIs+lI9JQ3XhPCowsOFdyzmpPp05TQhBMosJc3aQLRBsjRqRwLeOpiwnI1IB9HcMNVKtAIbcGI5FFpwU0877TcEdmsfbBBCvJyBHqPURY/BFOwEaze0bTrpiQQjH3DMPhcmxWCwbBKBvuGT65C0iTTkKTfgybkTWHMe1YYBvuBRvkLz7WxtkowsJV4aNSCCJgG+4w6OTJSIq5W51CEOaNm9EBwLJTX3DHaRPJjSk9w3NRvAzj4WZG7fmJJSj9QJcb1I+35azLZZMHy9ycloskaz/2WKchi8HFUhs2ZqGkxPJAvc26VNcxoe1EGZ/iYv9oFyxfJm0BM4pYjZ7n71jGjUYFgK5vnSf1ikPV32ew96xJ0jjOtMZUmm4RgdVEjIPYqGR+ysL5/YETgPY+APidS1IJeHcgpWv5VqQysH5AasHqRRcs2AVUZlojQDHeA8et7ZePwdE6fRpHPHirPxM3k/obylYUQC8h0CCa87vnuBkFX4J2io/OMFz5fhjyXJ8KLKuDpglSS9nSz18ZvnVNZyVkUDoTfXxgpvwXA3fHosV3+INTrrhJRZkNRCuYyXXVmwzmDfLyTIHUaw2ACt5u8Mm2wEw93A+halpRZ9z+VnOzm7ZrDDla7HZuTwSNoYLIT4QAI89TlpreI6ziJ0WzeVWnPpwvAGecggdcDuTguOuw/FpscZQvXx0d8772A8FhXYr0nU4BupBC4539i6cW0V2fFzXch1XeYteWGk5/uC/LYDG5Zrj47k8IH1r0Ys6Oo0VFIH6OHHWZOJ89cGfWzUI8ekVHOPdwKAiwbiCu88R/46lUQknWzWsFgehfeY/IiVVSwvCb1kbdVT9Pl7GBarOcvYwmG4/jogfuclmxmqPOjDNWQDtlY+5lXsEBZzrGHok+78qG9sKJLuJrppUbuRFZzrpzyoa22wOq9omTAjAac5WuJeq1E+lKiuvtxR/WjvDEOxUt3X9BYX0fxiteCElAAAAAElFTkSuQmCC',
}

export default {
  activable,
  legend,
  credit,
  others,
}
