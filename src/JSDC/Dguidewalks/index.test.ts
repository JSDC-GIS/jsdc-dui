import { GeoJSON, Path, TileLayer } from 'leaflet'
import Dguidewalks, { SCENE_LAYER_NAME } from '.'
import JSDCLayer from '../Layer/JSDCLayer'
import ConfigProvider, { ConfigProviderOptions } from './ConfigProvider'
import { IArticleProxyParser } from './proxyParser/@types'

const TILE_ATTRIBUTION = '&copy; NLSC'

const lineFeature = (name: string | null, extra: object = {}) => ({
  type: 'Feature',
  id: `f-${name}`,
  properties: { name, type: null, ...extra },
  geometry: {
    type: 'LineString',
    coordinates: [
      [121.28, 24.88],
      [121.29, 24.89],
    ],
  },
})

const polygonFeature = (properties: object) => ({
  type: 'Feature',
  properties,
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [121.28, 24.88],
          [121.29, 24.88],
          [121.29, 24.89],
          [121.28, 24.88],
        ],
      ],
    ],
  },
})

const collection = (features: object[]) => ({
  type: 'FeatureCollection',
  features,
})

// 檔案內容，key 是補齊 host 之後的完整網址
const geojsonFiles: Record<string, object> = {
  'https://dguidedwalks.mapelon.com/dguidedwalks.tw/map-data/n0004/line.geojson':
    collection([
      lineFeature('路線01', { nameEn: 'Route 01' }),
      lineFeature('路線02'),
      lineFeature('沒有對應樣式'),
      lineFeature(null),
    ]),
  'https://dguidedwalks.mapelon.com/dguidedwalks.tw/map-data/n0004/county.geojson':
    collection([
      polygonFeature({ NAME: '臺灣縣', name: '小寫不該被用到' }),
      polygonFeature({ NAME: null }),
    ]),
  'https://files.test/absolute/area.geojson': collection([
    polygonFeature({ name: '甲區' }),
  ]),
}

const mapConfig = {
  zoom: 16,
  baseLayers: [
    {
      name: '正射影像',
      url: 'https://tile.test/photo/{z}',
      attribution: TILE_ATTRIBUTION,
      default: false,
      nameEn: 'Orthophoto',
    },
    {
      name: '臺灣通用電子地圖',
      url: 'https://tile.test/emap/{z}',
      attribution: TILE_ATTRIBUTION,
      default: true,
    },
  ],
  overlays: [
    // 疊圖圖磚的 default 不算數
    { name: '堡圖', url: 'https://tile.test/old/{z}', default: true },
    {
      name: 'n0004-line',
      type: 'geojson',
      url: '/dguidedwalks.tw/map-data/n0004/line.geojson',
      style: { color: '#000000', weight: 4 },
      styleBy: {
        prop: 'name',
        styles: {
          路線01: { color: '#C424F4' },
          路線02: { color: '#312531', weight: 8 },
        },
      },
      visible: true,
      listed: false,
      // 規格外的欄位（e0003 有一個多餘的 show），忽略即可
      show: true,
    },
    {
      name: '縣界',
      type: 'geojson',
      url: '/dguidedwalks.tw/map-data/n0004/county.geojson',
      style: { color: '#a80019' },
      popupProp: 'NAME',
    },
    {
      name: '壞掉的圖層',
      type: 'geojson',
      url: '/dguidedwalks.tw/map-data/n0004/missing.geojson',
      visible: true,
    },
    { name: '航照', url: 'https://tile.test/aerial/{z}' },
    {
      name: '分區',
      type: 'geojson',
      url: 'https://files.test/absolute/area.geojson',
    },
  ],
}

const sceneFeature = (
  id: string,
  title: string,
  legacyGisId: string | null,
  hasGeometry = true,
) => ({
  type: 'Feature',
  id,
  geometry: hasGeometry
    ? { type: 'Point', coordinates: [121.28, 24.88] }
    : null,
  properties: {
    title,
    category: { code: 57, name: '歷史建物', icon: '02' },
    legacyGisId,
    legacyName: null,
    summary: `${title} 的中文介紹`,
    summaryEn: title === '02通議第' ? 'Tongyi Mansion' : null,
    coverImage: `https://media.test/${id}.jpg`,
    coverThumb: `https://media.test/small_${id}.jpg`,
    contributors: '林炯任',
    pageUrl: `https://page.test/${id}/`,
  },
})

const walkJson = {
  code: 'n0004',
  mapConfig,
  pois: {
    type: 'FeatureCollection',
    features: [
      sceneFeature('doc-1', '01大溪老街區', 'gis-uuid-1'),
      sceneFeature('doc-2', '02通議第', null),
      sceneFeature('doc-3', '03沒有座標', null, false),
    ],
  },
}

type Walk = 'ok' | 'http-error' | 'network-error' | 'no-map-config'

const mockFetch = (walk: Walk = 'ok', mapConfigOverride?: unknown) => {
  const fetchMock = jest.fn(async (url: string) => {
    const json = (body: unknown, ok = true, status = 200) => ({
      ok,
      status,
      json: async () => body,
    })
    if (url.includes('/walks/')) {
      if (walk === 'network-error') throw new TypeError('Failed to fetch')
      if (walk === 'http-error')
        return json({ data: null, error: {} }, false, 404)
      if (walk === 'no-map-config')
        return json({ ...walkJson, mapConfig: undefined })
      if (mapConfigOverride !== undefined)
        return json({ ...walkJson, mapConfig: mapConfigOverride })
      return json(walkJson)
    }
    if (url.endsWith('.geojson')) {
      return geojsonFiles[url]
        ? json(geojsonFiles[url])
        : json({ error: 'not found' }, false, 404)
    }
    throw new Error(`unexpected fetch: ${url}`)
  })
  ;(global as any).fetch = fetchMock
  return fetchMock
}

// 4 個 geojson 疊圖（含 1 個 404）各抓一次，加上 walk 一次
const MAP_DATA_FETCH_COUNT = 5

const createDgw = (
  options: Partial<ConfigProviderOptions> = {},
  articleParser?: IArticleProxyParser,
) =>
  new Dguidewalks({
    config: new ConfigProvider({ eventId: 'n0004', ...options }),
    articleParser,
  })

const walkCallsOf = (fetchMock: jest.Mock) =>
  fetchMock.mock.calls.filter(([url]) => String(url).includes('/walks/'))

const namesOf = (layers: Array<{ description: { name: string } }>) =>
  layers.map((layer) => layer.description.name)

const layerOf = (layers: JSDCLayer[], name: string) =>
  layers.find((layer) => layer.description.name === name)!

// GeoJSON 圖層裡每個圖形的 feature 與實際套用的樣式
const shapesOf = (layer: JSDCLayer) =>
  (layer.instance as GeoJSON).getLayers() as Array<
    Path & { feature: { properties: Record<string, any> } }
  >

describe('Dguidewalks 景點（Strapi）', () => {
  let errorSpy: jest.SpyInstance

  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
    warnSpy.mockRestore()
    delete (global as any).fetch
  })

  it('sceneApiUrl 有預設值，walk 網址用 eventId 組', async () => {
    const fetchMock = mockFetch()
    await createDgw().loadMapData()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dguidedwalks.mapelon.com/dguidedwalks.tw/api/map/walks/n0004',
    )

    const customFetchMock = mockFetch()
    await createDgw({
      sceneApiUrl: 'https://strapi.test/api/map/',
    }).loadMapData()
    expect(customFetchMock).toHaveBeenCalledWith(
      'https://strapi.test/api/map/walks/n0004',
    )
  })

  it('景點圖層略過沒有座標的景點，其餘原樣保留', async () => {
    mockFetch()
    const dgw = createDgw()
    expect(dgw.sceneLayer).toBeUndefined()
    await dgw.loadMapData()
    const features = dgw.sceneLayer?.instance?.toGeoJSON() as any
    expect(features.features.map((feature: any) => feature.id)).toEqual([
      'doc-1',
      'doc-2',
    ])
  })

  it('findSceneByTitle / findSceneById', async () => {
    mockFetch()
    const dgw = createDgw()
    await dgw.loadMapData()
    expect(dgw.findSceneByTitle('01 大溪老街區')?.feature.id).toBe('doc-1')
    expect(dgw.findSceneByTitle('通議第')?.feature.id).toBe('doc-2')
    expect(dgw.findSceneByTitle('不存在')).toBeUndefined()
    expect(dgw.findSceneById('doc-2')?.feature.id).toBe('doc-2')
    expect(dgw.findSceneById('gis-uuid-1')?.feature.id).toBe('doc-1')
    expect(dgw.findSceneById('doc-3')).toBeUndefined()
  })

  it('載入前查找回傳 undefined，不會丟例外', () => {
    const dgw = createDgw()
    expect(dgw.findSceneByTitle('01大溪老街區')).toBeUndefined()
    expect(dgw.findSceneById('doc-1')).toBeUndefined()
  })

  it.each<Walk>(['http-error', 'network-error'])(
    'walk 請求失敗（%s）時不 reject，回傳空的圖層清單',
    async (walk) => {
      const fetchMock = mockFetch(walk)
      const dgw = createDgw()
      const layers = await dgw.loadMapData()
      expect(layers).toEqual([])
      expect(dgw.sceneLayer).toBeUndefined()
      expect(dgw.findSceneById('doc-1')).toBeUndefined()
      expect(dgw.getPathColors()).toEqual([])
      expect(errorSpy).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    },
  )

  it('保留 walk 回應；失敗時為 undefined', async () => {
    mockFetch()
    const dgw = createDgw()
    expect(dgw.walk).toBeUndefined()
    await dgw.loadMapData()
    expect(dgw.walk?.code).toBe('n0004')

    mockFetch('http-error')
    const failed = createDgw()
    await failed.loadMapData()
    expect(failed.walk).toBeUndefined()
  })
})

describe('Dguidewalks 圖層（Strapi mapConfig）', () => {
  let errorSpy: jest.SpyInstance
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
    warnSpy.mockRestore()
    delete (global as any).fetch
  })

  it('圖層順序：baseLayers → overlays（照陣列順序）→ 景點；抓不到的 geojson 略過', async () => {
    mockFetch()
    const dgw = createDgw()
    const layers = await dgw.loadMapData()
    expect(namesOf(layers)).toEqual([
      '正射影像',
      '臺灣通用電子地圖',
      '堡圖',
      'n0004-line',
      '縣界',
      '航照',
      '分區',
      SCENE_LAYER_NAME,
    ])
    expect(layers[layers.length - 1]).toBe(dgw.sceneLayer)
    // 圖磚清單：baseLayers 在前、overlays 的圖磚在後
    expect(
      namesOf(layers.filter((layer) => layer.instance instanceof TileLayer)),
    ).toEqual(['正射影像', '臺灣通用電子地圖', '堡圖', '航照'])
  })

  it('圖磚：只有 baseLayers 的 default 預設顯示，全部列在清單，帶 nameEn 與 attribution', async () => {
    mockFetch()
    const layers = await createDgw().loadMapData()
    const tiles = layers.filter((layer) => layer.instance instanceof TileLayer)
    expect(
      tiles.map((layer) => [layer.description.name, layer.description.visible]),
    ).toEqual([
      ['正射影像', false],
      ['臺灣通用電子地圖', true],
      ['堡圖', false],
      ['航照', false],
    ])
    expect(tiles.every((layer) => layer.description.listed)).toBe(true)
    expect(tiles.every((layer) => layer.description.type === 'image')).toBe(
      true,
    )
    expect(layerOf(layers, '正射影像').description.nameEn).toBe('Orthophoto')
    expect(
      layerOf(layers, '臺灣通用電子地圖').description.nameEn,
    ).toBeUndefined()
    const emap = layerOf(layers, '臺灣通用電子地圖').instance as TileLayer
    expect(emap.getAttribution!()).toBe(TILE_ATTRIBUTION)
    expect(
      (layerOf(layers, '航照').instance as TileLayer).options.attribution,
    ).toBeUndefined()
  })

  it('geojson：相對網址補上 sceneApiUrl 的 origin，絕對網址原樣使用', async () => {
    const fetchMock = mockFetch()
    await createDgw().loadMapData()
    const urls = fetchMock.mock.calls.map(([url]) => url)
    expect(urls).toContain(
      'https://dguidedwalks.mapelon.com/dguidedwalks.tw/map-data/n0004/line.geojson',
    )
    expect(urls).toContain('https://files.test/absolute/area.geojson')

    const customFetchMock = mockFetch()
    const dgw = createDgw({ sceneApiUrl: 'https://strapi.test:8443/api/map/' })
    await dgw.loadMapData()
    expect(customFetchMock).toHaveBeenCalledWith(
      'https://strapi.test:8443/dguidedwalks.tw/map-data/n0004/line.geojson',
    )
    expect(dgw.api.resolveMapDataUrl('https://a.test/b.geojson')).toBe(
      'https://a.test/b.geojson',
    )
  })

  it('geojson：先套 style，styleBy 對得上的再覆寫；properties 保留檔案原文', async () => {
    mockFetch()
    const layers = await createDgw().loadMapData()
    const shapes = shapesOf(layerOf(layers, 'n0004-line'))
    expect(
      shapes.map((shape) => [
        shape.feature.properties.name,
        shape.options.color,
        shape.options.weight,
      ]),
    ).toEqual([
      ['路線01', '#C424F4', 4],
      ['路線02', '#312531', 8],
      ['沒有對應樣式', '#000000', 4],
      [null, '#000000', 4],
    ])
    expect(shapes[0].feature.properties).toEqual({
      name: '路線01',
      type: null,
      nameEn: 'Route 01',
    })
    // 沒有 styleBy 的圖層整層用 style
    expect(
      shapesOf(layerOf(layers, '縣界')).map((shape) => shape.options.color),
    ).toEqual(['#a80019', '#a80019'])
  })

  it('geojson：popupProp 照原文取屬性（大寫 NAME），沒有值的不綁 popup', async () => {
    mockFetch()
    const layers = await createDgw().loadMapData()
    const [named, unnamed] = shapesOf(layerOf(layers, '縣界'))
    const content = named.getPopup()?.getContent() as HTMLElement
    expect(content.textContent).toBe('臺灣縣')
    expect(unnamed.getPopup()).toBeUndefined()
    // 沒有設定 popupProp 的圖層不綁
    expect(
      shapesOf(layerOf(layers, 'n0004-line'))[0].getPopup(),
    ).toBeUndefined()
  })

  it('geojson：visible 未提供視為 false、listed 未提供視為 true；type 看幾何型別', async () => {
    mockFetch()
    const layers = await createDgw().loadMapData()
    const describe = (name: string) => {
      const { type, visible, listed } = layerOf(layers, name).description
      return { type, visible, listed }
    }
    expect(describe('n0004-line')).toEqual({
      type: 'line',
      visible: true,
      listed: false,
    })
    expect(describe('縣界')).toEqual({
      type: 'polygon',
      visible: false,
      listed: true,
    })
    expect(describe('分區')).toEqual({
      type: 'polygon',
      visible: false,
      listed: true,
    })
  })

  it('單一 geojson 抓取失敗只略過那個圖層並 console.warn，其他圖層照常', async () => {
    mockFetch()
    const dgw = createDgw()
    const layers = await dgw.loadMapData()
    expect(namesOf(layers)).not.toContain('壞掉的圖層')
    expect(namesOf(layers)).toEqual(
      expect.arrayContaining(['n0004-line', '縣界', '分區', '航照']),
    )
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain('壞掉的圖層')
    expect(errorSpy).not.toHaveBeenCalled()
    expect(dgw.geoJSONOverlayLayers.map(({ overlay }) => overlay.name)).toEqual(
      ['n0004-line', '縣界', '分區'],
    )
  })

  it('forEachLayerAsGeoJSON 照常能用，拿到檔案原文的 properties', async () => {
    mockFetch()
    const layers = await createDgw().loadMapData()
    const names: Array<string | null> = []
    layerOf(layers, 'n0004-line').forEachLayerAsGeoJSON<
      Path,
      { name: string | null }
    >((_layer, properties) => names.push(properties.name))
    expect(names).toEqual(['路線01', '路線02', '沒有對應樣式', null])
  })

  it('回應沒有 mapConfig 時不壞，只有景點圖層', async () => {
    mockFetch('no-map-config')
    const layers = await createDgw().loadMapData()
    expect(namesOf(layers)).toEqual([SCENE_LAYER_NAME])
  })

  describe('mapConfig 填錯時只少圖層並警告，不拖垮地圖與景點', () => {
    const tile = (name: string, extra: object = {}) => ({
      name,
      url: `https://tile.test/${name}/{z}`,
      ...extra,
    })
    const visibleOf = (layers: JSDCLayer[]) =>
      layers
        .filter((layer) => layer.description.visible)
        .map((layer) => layer.description.name)

    it('baseLayers 沒有任何 default: true 時退回第一個底圖並警告', async () => {
      mockFetch('ok', {
        baseLayers: [tile('甲'), tile('乙', { default: false })],
        overlays: [tile('疊圖', { default: true })],
      })
      const layers = await createDgw().loadMapData()
      expect(visibleOf(layers)).toEqual(['甲'])
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain(
        'no base layer has "default: true"',
      )
    })

    it('有多筆 default: true 時只取第一筆，其餘警告', async () => {
      mockFetch('ok', {
        baseLayers: [
          tile('甲'),
          tile('乙', { default: true }),
          tile('丙', { default: true }),
        ],
        overlays: [],
      })
      const layers = await createDgw().loadMapData()
      expect(visibleOf(layers)).toEqual(['乙'])
      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][1]).toEqual(['丙'])
    })

    it('剛好一筆 default: true 時不警告；沒有 baseLayers 時也不警告', async () => {
      mockFetch('ok', {
        baseLayers: [tile('甲'), tile('乙', { default: true })],
        overlays: [],
      })
      expect(visibleOf(await createDgw().loadMapData())).toEqual(['乙'])
      mockFetch('ok', { baseLayers: [], overlays: [] })
      expect(namesOf(await createDgw().loadMapData())).toEqual([
        SCENE_LAYER_NAME,
      ])
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it.each([
      [
        'baseLayers 是物件',
        { baseLayers: { name: '甲' }, overlays: [tile('疊圖')] },
        ['疊圖'],
      ],
      [
        'overlays 是字串',
        { baseLayers: [tile('甲', { default: true })], overlays: 'oops' },
        ['甲'],
      ],
      ['兩個都是 null', { baseLayers: null, overlays: null }, []],
      ['mapConfig 是字串', 'oops', []],
      [
        '陣列裡有不是物件的項目',
        {
          baseLayers: [null, 'x', tile('甲', { default: true })],
          overlays: [42, tile('疊圖')],
        },
        ['甲', '疊圖'],
      ],
    ])('%s：不丟例外，其餘圖層與景點照常', async (_title, config, expected) => {
      mockFetch('ok', config)
      const dgw = createDgw()
      const layers = await dgw.loadMapData()
      expect(namesOf(layers)).toEqual([...expected, SCENE_LAYER_NAME])
      expect(dgw.sceneLayer).toBeDefined()
      expect(dgw.findSceneById('doc-1')).toBeDefined()
      expect(errorSpy).not.toHaveBeenCalled()
    })

    it('不是陣列時有警告', async () => {
      mockFetch('ok', { baseLayers: {}, overlays: 'oops' })
      await createDgw().loadMapData()
      expect(warnSpy.mock.calls.map(([message]) => message)).toEqual([
        '[map config]: "baseLayers" is not an array, ignored',
        '[map config]: "overlays" is not an array, ignored',
      ])
    })

    it('geojson 疊圖缺 name 或 url 時警告後略過，不抓檔也不建圖層', async () => {
      const fetchMock = mockFetch('ok', {
        baseLayers: [tile('甲', { default: true })],
        overlays: [
          {
            type: 'geojson',
            url: '/dguidedwalks.tw/map-data/n0004/line.geojson',
          },
          {
            type: 'geojson',
            name: '',
            url: '/dguidedwalks.tw/map-data/n0004/line.geojson',
          },
          { type: 'geojson', name: '沒有網址' },
          {
            type: 'geojson',
            name: '正常',
            url: '/dguidedwalks.tw/map-data/n0004/line.geojson',
          },
        ],
      })
      const dgw = createDgw()
      const layers = await dgw.loadMapData()
      expect(namesOf(layers)).toEqual(['甲', '正常', SCENE_LAYER_NAME])
      expect(warnSpy).toHaveBeenCalledTimes(3)
      warnSpy.mock.calls.forEach(([message]) =>
        expect(message).toBe(
          '[map config]: geojson overlay without name or url',
        ),
      )
      // walk 一次 + 正常的那個檔一次
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(dgw.geoJSONOverlayLayers).toHaveLength(1)
    })

    it('圖磚缺 name 或 url 時警告後略過', async () => {
      mockFetch('ok', {
        baseLayers: [
          { url: 'https://tile.test/x' },
          tile('甲', { default: true }),
        ],
        overlays: [{ name: '沒有網址' }],
      })
      expect(namesOf(await createDgw().loadMapData())).toEqual([
        '甲',
        SCENE_LAYER_NAME,
      ])
      expect(warnSpy).toHaveBeenCalledTimes(2)
    })

    it('styleBy.prop 指到不存在或 null 的屬性時不套 styleBy（不會比對字串 undefined / null）', async () => {
      mockFetch('ok', {
        baseLayers: [tile('甲', { default: true })],
        overlays: [
          {
            type: 'geojson',
            name: 'line',
            url: '/dguidedwalks.tw/map-data/n0004/line.geojson',
            style: { color: '#000000' },
            styleBy: {
              prop: 'nope',
              styles: { undefined: { color: '#ff0000' } },
            },
          },
          {
            type: 'geojson',
            name: 'by-name',
            url: '/dguidedwalks.tw/map-data/n0004/line.geojson',
            style: { color: '#000000' },
            styleBy: {
              prop: 'name',
              styles: {
                null: { color: '#ff0000' },
                路線01: { color: '#C424F4' },
              },
            },
          },
        ],
      })
      const dgw = createDgw()
      const layers = await dgw.loadMapData()
      expect(
        shapesOf(layerOf(layers, 'line')).map((shape) => shape.options.color),
      ).toEqual(['#000000', '#000000', '#000000', '#000000'])
      // 第 4 個線段的 name 是 null：不能對到 key 'null'
      expect(
        shapesOf(layerOf(layers, 'by-name')).map(
          (shape) => shape.options.color,
        ),
      ).toEqual(['#C424F4', '#000000', '#000000', '#000000'])
      // 路線顏色也一樣：prop 不存在的沒有名稱、不列；有名稱的不會拿到 'null' 的顏色
      expect(
        dgw.getPathColors().map((item) => [item.name, item.color]),
      ).toEqual([
        ['路線01', '#C424F4'],
        ['路線02', '#000000'],
        ['沒有對應樣式', '#000000'],
      ])
    })

    it('sceneApiUrl 是相對路徑時，以目前頁面的網址解析，線、面照常載入', async () => {
      const fetchMock = mockFetch()
      const dgw = createDgw({ sceneApiUrl: '/dguidedwalks.tw/api/map/' })
      const { origin } = window.location
      expect(
        dgw.api.resolveMapDataUrl(
          '/dguidedwalks.tw/map-data/n0004/line.geojson',
        ),
      ).toBe(`${origin}/dguidedwalks.tw/map-data/n0004/line.geojson`)
      expect(dgw.api.resolveMapDataUrl('https://a.test/b.geojson')).toBe(
        'https://a.test/b.geojson',
      )
      // 不帶開頭 / 的相對網址照標準 URL 規則，相對於 sceneApiUrl
      expect(dgw.api.resolveMapDataUrl('files/b.geojson')).toBe(
        `${origin}/dguidedwalks.tw/api/map/files/b.geojson`,
      )
      await dgw.loadMapData()
      expect(fetchMock).toHaveBeenCalledWith(
        `${origin}/dguidedwalks.tw/map-data/n0004/line.geojson`,
      )
    })
  })

  it('walk 請求失敗時的訊息說明實際影響（底圖、線、面、景點都沒有）', async () => {
    mockFetch('http-error')
    await createDgw().loadMapData()
    expect(errorSpy).toHaveBeenCalledTimes(1)
    const [message, error] = errorSpy.mock.calls[0]
    expect(message).toContain('/walks/n0004')
    expect(message).toContain('no base layers, routes, polygons or scenes')
    expect(message).not.toContain('scene api')
    expect(String(error)).toContain('[walk api]: 404')
  })

  it('整個生命週期只打一次 walk，沒有任何 GIS 後端的請求', async () => {
    const fetchMock = mockFetch()
    const dgw = createDgw()
    await dgw.loadMapData()
    await dgw.getSceneArticles('en')
    expect(walkCallsOf(fetchMock)).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledTimes(MAP_DATA_FETCH_COUNT)
    fetchMock.mock.calls.forEach(([url]) =>
      expect(url).not.toMatch(/webgis|\/layers|\/basemaps/),
    )
  })

  it('getPathColors 由已載入的線圖層產生', async () => {
    mockFetch()
    const dgw = createDgw()
    expect(dgw.getPathColors()).toEqual([])
    await dgw.loadMapData()
    expect(dgw.getPathColors('zh-TW')).toEqual([
      { name: '路線01', label: '路線01', color: '#C424F4' },
      { name: '路線02', label: '路線02', color: '#312531' },
      { name: '沒有對應樣式', label: '沒有對應樣式', color: '#000000' },
    ])
    expect(dgw.getPathColors('en').map((item) => item.label)).toEqual([
      'Route 01',
      '路線02',
      '沒有對應樣式',
    ])
  })

  it('舊名稱是 deprecated 別名：gisDataLoadEvent 與 dataLoadEvent 是同一個事件', async () => {
    mockFetch()
    const dgw = createDgw()
    expect(dgw.gisDataLoadEvent).toBe(dgw.dataLoadEvent)
    const listener = jest.fn()
    dgw.gisDataLoadEvent.addEventListener(listener)
    dgw.dataLoadEvent.raise()
    expect(listener).toHaveBeenCalledTimes(1)
    // loadGisData 也是 loadMapData 的別名
    expect(namesOf(await dgw.loadGisData())).toEqual(
      namesOf(await dgw.loadMapData()),
    )
  })
})

describe('Dguidewalks 景點文章（內建 Strapi 來源）', () => {
  let errorSpy: jest.SpyInstance

  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
    warnSpy.mockRestore()
    delete (global as any).fetch
  })

  it('景點圖層、列表、詳細內文、換語言共用同一次 walk 請求', async () => {
    const fetchMock = mockFetch()
    const dgw = createDgw()
    await dgw.loadMapData()
    const zh = await dgw.getSceneArticles('zh-TW')
    const en = await dgw.getSceneArticles('en')
    await dgw.getSceneDetailArticle(dgw.findSceneById('doc-2')!.feature)
    await dgw.getSceneDetailArticle(dgw.findSceneById('doc-1')!.feature, 'en')

    expect(walkCallsOf(fetchMock)).toHaveLength(1)
    // 只有 walk 與各 GeoJSON 檔，沒有 GIS、Drupal 或 proxy 請求
    expect(fetchMock).toHaveBeenCalledTimes(MAP_DATA_FETCH_COUNT)
    expect(
      fetchMock.mock.calls.filter(([url]) => /webgis|jsonapi/.test(url)),
    ).toEqual([])
    // 列表含沒有座標的景點，順序照 API
    expect(zh.map((article) => article.title)).toEqual([
      '01大溪老街區',
      '02通議第',
      '03沒有座標',
    ])
    // 列表每筆帶景點 id，與地圖 marker 的 feature.id 是同一個
    expect(zh.map((article) => article.id)).toEqual(['doc-1', 'doc-2', 'doc-3'])
    expect(zh[0].feature?.id).toBe(dgw.findSceneById('doc-1')!.feature.id)
    expect(zh[2].feature?.geometry).toBeNull()
    expect(zh[1].content).toBe('02通議第 的中文介紹')
    expect(en[1].content).toBe('Tongyi Mansion')
    // 英文沒填的退回中文
    expect(en[0].content).toBe('01大溪老街區 的中文介紹')
  })

  it('文章先被要求、地圖後載入，仍然只打一次', async () => {
    const fetchMock = mockFetch()
    const dgw = createDgw()
    const articles = dgw.getSceneArticles('zh-TW')
    const layers = dgw.loadMapData()
    await Promise.all([articles, layers])
    expect(walkCallsOf(fetchMock)).toHaveLength(1)
    expect(dgw.sceneLayer).toBeDefined()
  })

  it('列表項目的 feature 可以直接拿去取詳細內文，不必先載入地圖', async () => {
    const fetchMock = mockFetch()
    const dgw = createDgw()
    const [article] = await dgw.getSceneArticles('zh-TW')
    expect(await dgw.getSceneDetailArticle(article.feature!)).toEqual({
      title: '01大溪老街區',
      subtitle: '01大溪老街區',
      content: '01大溪老街區 的中文介紹',
      contentHtml: '<p>01大溪老街區 的中文介紹</p>',
      imgSrc: 'https://media.test/doc-1.jpg',
      link: 'https://page.test/doc-1/',
      ref: '撰稿者：林炯任',
    })
    expect(walkCallsOf(fetchMock)).toHaveLength(1)
  })

  it('getSceneDetailArticle 直接讀點到的 feature，並套用傳入的語系', async () => {
    mockFetch()
    const dgw = createDgw()
    await dgw.loadMapData()
    const feature = dgw.findSceneById('doc-2')!.feature
    expect((await dgw.getSceneDetailArticle(feature, 'en')).content).toBe(
      'Tongyi Mansion',
    )
    expect((await dgw.getSceneDetailArticle(feature, 'zh-TW')).content).toBe(
      '02通議第 的中文介紹',
    )
  })

  it('下游自帶的 parser 一樣只收到 feature，Dguidewalks 不做 title 反查', async () => {
    mockFetch()
    const customParser = {
      getAll: jest.fn(),
      setLanguage: jest.fn(),
      getDetailByFeature: jest.fn(async () => ({ title: 'from custom' })),
    } as unknown as IArticleProxyParser
    const dgw = createDgw({}, customParser)
    await dgw.loadMapData()
    const feature = dgw.findSceneById('doc-1')!.feature
    expect(await dgw.getSceneDetailArticle(feature, 'en')).toEqual({
      title: 'from custom',
    })
    expect(customParser.setLanguage).toHaveBeenCalledWith('en')
    expect(customParser.getDetailByFeature).toHaveBeenCalledWith(feature)
  })

  it('景點 API 失敗時列表是空的，錯誤只記錄一次', async () => {
    mockFetch('http-error')
    const dgw = createDgw()
    await dgw.loadMapData()
    expect(await dgw.getSceneArticles()).toEqual([])
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
