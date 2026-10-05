import { getSceneIconUrl } from '../../icon'
import { SceneCategory, SceneFeature, SceneProperties } from './ApiProvider'
import {
  SCENE_LAYER_NAME,
  createSceneLayer,
  findSceneById,
  findSceneByTitle,
  getSceneCheckinKey,
  getSceneCheckinName,
  getSceneCheckinSrc,
  getSceneMarkers,
  getSceneShareUrl,
  getSceneValidDistance,
  isSceneDebugMode,
  parseSceneNavigationMessage,
} from './scene'

const category = (icon: string): SceneCategory => ({
  code: 19,
  slug: '人文地景',
  name: '人文地景',
  color: '#062060',
  icon,
  iconUrl: `https://example.test/attraction-icon${icon}.png`,
})

// 只填測試會讀到的欄位，其餘欄位與比對邏輯無關
const scene = (
  id: string,
  props: Partial<SceneProperties>,
  coordinates: [number, number] | null = [121.28, 24.88],
): SceneFeature => ({
  type: 'Feature',
  id,
  geometry: coordinates ? { type: 'Point', coordinates } : null,
  properties: {
    title: id,
    category: category('01'),
    legacyGisId: null,
    legacyName: null,
    ...props,
  } as SceneProperties,
})

const iconUrlOf = (feature: SceneFeature) =>
  getSceneMarkers(createSceneLayer([feature]))[0].options.icon?.options.iconUrl

describe('getSceneIconUrl', () => {
  const base = 'https://map.jsdc.com.tw/webgis/dguidewalks/assets/map_icons/'

  it('編號直接取 category.icon，去掉前導 0', () => {
    expect(getSceneIconUrl(category('01'))).toBe(`${base}type1.svg`)
    expect(getSceneIconUrl(category('12'))).toBe(`${base}type12.svg`)
  })

  it('09、10 不對調', () => {
    expect(getSceneIconUrl(category('09'))).toBe(`${base}type9.svg`)
    expect(getSceneIconUrl(category('10'))).toBe(`${base}type10.svg`)
  })

  it('沒有分類或編號無法解析時用 type1', () => {
    expect(getSceneIconUrl(null)).toBe(`${base}type1.svg`)
    expect(getSceneIconUrl(undefined)).toBe(`${base}type1.svg`)
    expect(getSceneIconUrl(category(''))).toBe(`${base}type1.svg`)
    expect(getSceneIconUrl(category('abc'))).toBe(`${base}type1.svg`)
  })
})

describe('createSceneLayer', () => {
  it('固定的 id、name 與 point 型別', () => {
    const layer = createSceneLayer([])
    expect(layer.id).toBe(SCENE_LAYER_NAME)
    expect(layer.description).toEqual({ name: SCENE_LAYER_NAME, type: 'point' })
  })

  it('feature 原樣保留：id 是 documentId，properties 不改寫', () => {
    const feature = scene('doc-1', { title: '01大溪老街區', seq: '01' })
    const [marker] = getSceneMarkers(createSceneLayer([feature]))
    expect(marker.feature.id).toBe('doc-1')
    expect(marker.feature.properties).toBe(feature.properties)
    expect(marker.getLatLng()).toEqual({ lat: 24.88, lng: 121.28 })
  })

  it('略過 geometry 為 null 的景點', () => {
    const layer = createSceneLayer([
      scene('doc-1', {}),
      scene('doc-2', {}, null),
      scene('doc-3', {}),
    ])
    expect(getSceneMarkers(layer).map((marker) => marker.feature.id)).toEqual([
      'doc-1',
      'doc-3',
    ])
  })

  it('marker 的 icon 依 category.icon 設定', () => {
    expect(iconUrlOf(scene('a', { category: category('09') }))).toMatch(
      /map_icons\/type9\.svg$/,
    )
    expect(iconUrlOf(scene('b', { category: category('10') }))).toMatch(
      /map_icons\/type10\.svg$/,
    )
    expect(iconUrlOf(scene('c', { category: null }))).toMatch(
      /map_icons\/type1\.svg$/,
    )
    const [marker] = getSceneMarkers(createSceneLayer([scene('d', {})]))
    expect(marker.options.icon?.options.iconSize).toEqual([30, 40])
  })
})

describe('findSceneByTitle', () => {
  const markers = getSceneMarkers(
    createSceneLayer([
      scene('long', { title: '02三坑老街' }),
      scene('short', { title: '三坑' }),
      scene('beipu', { title: '37 北埔老街\n37 Beipu Old Street' }),
    ]),
  )
  const idOf = (title: string) => findSceneByTitle(markers, title)?.feature.id

  it('正規化後完全相同優先，短名不會誤中長名', () => {
    expect(idOf('三坑')).toBe('short')
    expect(idOf('37北埔老街 37 beipu old street')).toBe('beipu')
  })

  it('沒有完全相同時退到雙向 contains', () => {
    // 查詢字串比較短（少了編號前綴）
    expect(idOf('三坑老街')).toBe('long')
    // 查詢字串比較長（多了前綴）
    expect(idOf('景點：37 北埔老街 37 Beipu Old Street')).toBe('beipu')
  })

  it('找不到回傳 undefined', () => {
    expect(idOf('大溪老街')).toBeUndefined()
    expect(idOf('')).toBeUndefined()
    expect(idOf('   ')).toBeUndefined()
    expect(findSceneByTitle([], '三坑')).toBeUndefined()
  })
})

describe('findSceneById', () => {
  const markers = getSceneMarkers(
    createSceneLayer([
      scene('doc-1', { legacyGisId: '59b6977e-fd87-4a31-868b-33b76ad6e058' }),
      scene('doc-2', { legacyGisId: null }),
    ]),
  )

  it('用 documentId 找', () => {
    expect(findSceneById(markers, 'doc-2')?.feature.id).toBe('doc-2')
  })

  it('用 legacyGisId 找', () => {
    expect(
      findSceneById(markers, '59b6977e-fd87-4a31-868b-33b76ad6e058')?.feature
        .id,
    ).toBe('doc-1')
  })

  it('找不到回傳 undefined', () => {
    expect(findSceneById(markers, 'nope')).toBeUndefined()
    expect(findSceneById(markers, '')).toBeUndefined()
  })
})

describe('集章 key', () => {
  // n0006 的舊點：GIS 原名用小型括號 ﹙﹚，Strapi title 用全形括號 （）
  const legacy = scene('doc-legacy', {
    title: '15經國紀念館（大溪遊客中心）',
    legacyName: '15經國紀念館﹙大溪遊客中心﹚',
  })
  const normal = scene('doc-normal', { title: '01大溪老街區' })

  it('一般景點用 title', () => {
    expect(getSceneCheckinName(normal)).toBe('01大溪老街區')
    expect(getSceneCheckinKey('n0004', normal)).toBe(
      window.btoa(encodeURI('n0004:01大溪老街區')),
    )
  })

  it('有 legacyName 的舊點沿用 GIS 原名，key 與遷移前完全相同', () => {
    expect(getSceneCheckinName(legacy)).toBe('15經國紀念館﹙大溪遊客中心﹚')
    expect(getSceneCheckinKey('n0006', legacy)).toBe(
      window.btoa(encodeURI('n0006:15經國紀念館﹙大溪遊客中心﹚')),
    )
    // 用 title 組出來的是另一個 key，等於另一個集章點
    expect(getSceneCheckinKey('n0006', legacy)).not.toBe(
      window.btoa(encodeURI('n0006:15經國紀念館（大溪遊客中心）')),
    )
  })

  it('預設的集章網址', () => {
    expect(getSceneCheckinSrc('n0004', normal)).toBe(
      `https://map.jsdc.com.tw/tools/checkin/n0004/ci.php?s=${window.btoa(
        encodeURI('n0004:01大溪老街區'),
      )}`,
    )
  })
})

describe('getSceneShareUrl', () => {
  it('用 documentId 組，不帶原本的 query 與 hash', () => {
    expect(
      getSceneShareUrl(scene('doc 1/a', {}), {
        origin: 'https://map.test',
        pathname: '/webgis/n0004/',
      }),
    ).toBe('https://map.test/webgis/n0004/?id=doc%201%2Fa')
  })
})

describe('集章有效距離', () => {
  it('網址帶 #debug 才是測試模式', () => {
    expect(isSceneDebugMode('https://map.test/n0004/#debug')).toBe(true)
    expect(isSceneDebugMode('https://map.test/n0004/?id=abc#debug')).toBe(true)
    expect(isSceneDebugMode('https://map.test/n0004/')).toBe(false)
    expect(isSceneDebugMode('https://map.test/n0004/?debug=1')).toBe(false)
  })

  it('預設 100 公尺，測試模式不限距離', () => {
    expect(getSceneValidDistance('https://map.test/n0004/')).toBe(100)
    expect(getSceneValidDistance('https://map.test/n0004/#debug')).toBe(
      Infinity,
    )
  })

  it('可以指定距離；測試模式仍然不限', () => {
    expect(getSceneValidDistance('https://map.test/n0004/', 50)).toBe(50)
    expect(getSceneValidDistance('https://map.test/n0004/', Infinity)).toBe(
      Infinity,
    )
    expect(getSceneValidDistance('https://map.test/n0004/#debug', 50)).toBe(
      Infinity,
    )
  })
})

describe('集章 iframe 的導航訊息', () => {
  it("解析 'lng,lat' 字串", () => {
    expect(parseSceneNavigationMessage('121.285235,24.883351')).toEqual({
      lat: 24.883351,
      lng: 121.285235,
    })
    expect(parseSceneNavigationMessage(' 121.28 , 24.88 ')).toEqual({
      lat: 24.88,
      lng: 121.28,
    })
  })

  it.each([
    ['非字串（其他 iframe、擴充功能的物件）', { type: 'webpackOk' }],
    ['undefined', undefined],
    ['不是數字', 'hello,world'],
    ['只有一個值', '121.28'],
    ['多於兩個值', '121.28,24.88,10'],
    ['空字串', ''],
    ['缺一邊', '121.28,'],
  ])('忽略格式不對的訊息：%s', (_name, data) => {
    expect(parseSceneNavigationMessage(data)).toBeUndefined()
  })
})
