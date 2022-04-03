import { chain } from "lodash"

export const BASEMAPS = {
  '臺灣通用電子地圖(灰階)': 'https://wmts.nlsc.gov.tw/wmts/EMAP01/default/GoogleMapsCompatible/{z}/{y}/{x}',
  '日治臺灣堡圖(明治版)': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1904-jpg-{z}-{x}-{y}',
  '臺灣經建1版地形圖': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM25K_1989-jpg-{z}-{x}-{y}',
  '石門水利會1965年灌溉區域圖': 'http://gis.sinica.edu.tw/taoyuan/file-exists.php?img=shimen_IR4-png-{z}-{x}-{y}',
  '桃園水利會灌溉區域圖(1999)': 'http://gis.sinica.edu.tw/taoyuan/file-exists.php?img=Taoyaun_Irrigation_1999-png-{z}-{x}-{y}',
  '正射影像圖(通用)': 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
  'GoogleMap': 'https://mt0.google.com/vt/lyrs=r&hl=zh-TW&x={x}&y={y}&z={z}',
  '臺灣通用正射影像': 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
  '臺灣通用電子地圖': 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/{z}/{y}/{x}',
  '日治臺灣堡圖(大正版1921)': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1921-jpg-{z}-{x}-{y}',
  '2001-臺灣經建3版地形圖-1:25,000': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM25K_2001-jpg-{z}-{x}-{y}',
  '嘉南大圳平圖(1933)': 'http://gis.sinica.edu.tw/tainan/file-exists.php?img=chianan_100K_1933-png-{z}-{x}-{y}',
  '魯地圖 Taiwan TOPO': 'https://rs.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png',
  '1934-日治三十萬分之一台灣全圖	': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM300K_1934-jpg-{z}-{x}-{y}',
  '1916-日治蕃地地形圖	': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM50K_1916-jpg-{z}-{x}-{y}',
  '1904-日治臺灣堡圖(明治版)': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1904-jpg-{z}-{x}-{y}',
  '1897-日治臺灣假製二十萬分一圖	': 'https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM200K_1897_new-png-{z}-{x}-{y}',
}

export type BasemapName = keyof typeof BASEMAPS

class BasemapProvider {
  private _basemaps = BASEMAPS
  activeMaps: Array<BasemapName>
  constructor (activeMaps: Array<BasemapName>) {
    this.activeMaps = activeMaps
  }

  listAll () {
    return chain(this._basemaps)
      .map((value, key) => ({ name: key, url: value}))
      .filter(value => this.activeMaps.includes(value.name as BasemapName))
      .value()
      
  }
}

export default BasemapProvider
