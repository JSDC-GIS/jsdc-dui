export const baseUrl = 'https://map.jsdc.com.tw/webgis/dguidewalks/assets/'

export const legend = {
  '人文地景': {
      default: `${baseUrl}legends/icon-l-01-g.svg`,
      active: `${baseUrl}legends/icon-l-01.svg`
  },
  '歷史建物': {
      default: `${baseUrl}legends/icon-l-02-g.svg`,
      active: `${baseUrl}legends/icon-l-02.svg`
  },
  '聚落': {
      default: `${baseUrl}legends/icon-l-03-g.svg`,
      active: `${baseUrl}legends/icon-l-03.svg`
  },
  '自然地景': {
      default: `${baseUrl}legends/icon-l-04-g.svg`,
      active: `${baseUrl}legends/icon-l-04.svg`
  },
  '田園景色': {
      default: `${baseUrl}legends/icon-l-05-g.svg`,
      active: `${baseUrl}legends/icon-l-05.svg`
  },
  '資訊站': {
      default: `${baseUrl}legends/icon-l-06-g.svg`,
      active: `${baseUrl}legends/icon-l-06.svg`
  },
  '紀念指標': {
      default: `${baseUrl}legends/icon-l-07-g.svg`,
      active: `${baseUrl}legends/icon-l-07.svg`
  },
  '展覽場館': {
      default: `${baseUrl}legends/icon-l-08-g.svg`,
      active: `${baseUrl}legends/icon-l-08.svg`
  },
  '水利工程': {
      default: `${baseUrl}legends/icon-l-09-g.svg`,
      active: `${baseUrl}legends/icon-l-09.svg`
  },
  '工作站': {
      default: `${baseUrl}legends/icon-l-10-g.svg`,
      active: `${baseUrl}legends/icon-l-10.svg`
  }
}

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
    processing: `${baseUrl}others/processing.gif`
}

export default {
  activable,
  legend,
  credit,
  others
}
