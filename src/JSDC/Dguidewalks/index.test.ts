import Dguidewalks, { SCENE_LAYER_NAME } from '.'
import ConfigProvider, { ConfigProviderOptions } from './ConfigProvider'
import { IArticleProxyParser } from './proxyParser/@types'

const gisLayer = (name: string, type: string, featureKey?: string) => ({
  id: `id-${name}`,
  name,
  type,
  eventId: 'n0004',
  options: null,
  createdAt: '',
  updatedAt: '',
  Basemap: null,
  LineFeatures: [],
  PointFeatures: [],
  PolygonFeatures: [],
  ...(featureKey && {
    [featureKey]: [
      {
        id: `f-${name}`,
        layerId: `id-${name}`,
        name: `${name} feature`,
        type: '1',
        url: null,
        options: null,
        geometry:
          featureKey === 'PointFeatures'
            ? { type: 'Point', coordinates: [121.28, 24.88] }
            : featureKey === 'LineFeatures'
              ? {
                  type: 'LineString',
                  coordinates: [
                    [121.28, 24.88],
                    [121.29, 24.89],
                  ],
                }
              : {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [121.28, 24.88],
                      [121.29, 24.88],
                      [121.29, 24.89],
                      [121.28, 24.88],
                    ],
                  ],
                },
      },
    ],
  }),
})

const layersJson = [
  gisLayer('n0004-point', 'point', 'PointFeatures'),
  gisLayer('牡丹社景點', 'point', 'PointFeatures'),
  gisLayer('n0004-line', 'line', 'LineFeatures'),
  gisLayer('n0004-polygon', 'polygon', 'PolygonFeatures'),
]

const basemapsJson = [
  {
    id: 1,
    name: '臺灣通用電子地圖',
    type: 'xyz',
    url: 'https://tile.test/{z}',
  },
]

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
  pois: {
    type: 'FeatureCollection',
    features: [
      sceneFeature('doc-1', '01大溪老街區', 'gis-uuid-1'),
      sceneFeature('doc-2', '02通議第', null),
      sceneFeature('doc-3', '03沒有座標', null, false),
    ],
  },
}

type Walk = 'ok' | 'http-error' | 'network-error'

const mockFetch = (walk: Walk = 'ok') => {
  const fetchMock = jest.fn(async (url: string) => {
    const json = (body: unknown, ok = true, status = 200) => ({
      ok,
      status,
      json: async () => body,
    })
    if (url.endsWith('/layers')) return json(layersJson)
    if (url.endsWith('/basemaps')) return json(basemapsJson)
    if (url.includes('/walks/')) {
      if (walk === 'network-error') throw new TypeError('Failed to fetch')
      if (walk === 'http-error')
        return json({ data: null, error: {} }, false, 404)
      return json(walkJson)
    }
    throw new Error(`unexpected fetch: ${url}`)
  })
  ;(global as any).fetch = fetchMock
  return fetchMock
}

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

describe('Dguidewalks 景點（Strapi）', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
    delete (global as any).fetch
  })

  it('sceneApiUrl 有預設值，walk 網址用 eventId 組', async () => {
    const fetchMock = mockFetch()
    await createDgw().loadGisData()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://trfc-test.mapelon.com/dguidedwalks.tw/api/map/walks/n0004',
    )

    const customFetchMock = mockFetch()
    await createDgw({
      sceneApiUrl: 'https://strapi.test/api/map/',
    }).loadGisData()
    expect(customFetchMock).toHaveBeenCalledWith(
      'https://strapi.test/api/map/walks/n0004',
    )
  })

  it('預設不建 `${eventId}-point`，其他 point、線、面圖層與底圖照舊', async () => {
    mockFetch()
    const dgw = createDgw()
    const layers = await dgw.loadGisData()
    expect(namesOf(layers)).toEqual([
      '牡丹社景點',
      'n0004-line',
      'n0004-polygon',
      SCENE_LAYER_NAME,
      '臺灣通用電子地圖',
    ])
    expect(layers).toContain(dgw.sceneLayer)
  })

  it('gisSceneLayerNames 可以指定要略過的 point 圖層', async () => {
    mockFetch()
    const layers = await createDgw({
      gisSceneLayerNames: ['牡丹社景點', 'n0004-line'],
    }).loadGisData()
    // 只略過 point 型圖層；同名的線圖層不受影響
    expect(namesOf(layers)).toEqual([
      'n0004-point',
      'n0004-line',
      'n0004-polygon',
      SCENE_LAYER_NAME,
      '臺灣通用電子地圖',
    ])
  })

  it('景點圖層略過沒有座標的景點，其餘原樣保留', async () => {
    mockFetch()
    const dgw = createDgw()
    expect(dgw.sceneLayer).toBeUndefined()
    await dgw.loadGisData()
    const features = dgw.sceneLayer?.instance?.toGeoJSON() as any
    expect(features.features.map((feature: any) => feature.id)).toEqual([
      'doc-1',
      'doc-2',
    ])
  })

  it('findSceneByTitle / findSceneById', async () => {
    mockFetch()
    const dgw = createDgw()
    await dgw.loadGisData()
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
    '景點 API 失敗（%s）時不 reject，GIS 圖層與底圖照常載入',
    async (walk) => {
      mockFetch(walk)
      const dgw = createDgw()
      const layers = await dgw.loadGisData()
      expect(namesOf(layers)).toEqual([
        '牡丹社景點',
        'n0004-line',
        'n0004-polygon',
        '臺灣通用電子地圖',
      ])
      expect(dgw.sceneLayer).toBeUndefined()
      expect(dgw.findSceneById('doc-1')).toBeUndefined()
      expect(errorSpy).toHaveBeenCalledTimes(1)
    },
  )

  it('保留 walk 回應；失敗時為 undefined', async () => {
    mockFetch()
    const dgw = createDgw()
    expect(dgw.walk).toBeUndefined()
    await dgw.loadGisData()
    expect(dgw.walk?.code).toBe('n0004')

    mockFetch('http-error')
    const failed = createDgw()
    await failed.loadGisData()
    expect(failed.walk).toBeUndefined()
  })
})

describe('Dguidewalks 景點文章（內建 Strapi 來源）', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
    delete (global as any).fetch
  })

  it('景點圖層、列表、詳細內文、換語言共用同一次 walk 請求', async () => {
    const fetchMock = mockFetch()
    const dgw = createDgw()
    await dgw.loadGisData()
    const zh = await dgw.getSceneArticles('zh-TW')
    const en = await dgw.getSceneArticles('en')
    await dgw.getSceneDetailArticle(dgw.findSceneById('doc-2')!.feature)
    await dgw.getSceneDetailArticle(dgw.findSceneById('doc-1')!.feature, 'en')

    expect(walkCallsOf(fetchMock)).toHaveLength(1)
    // 只打景點、圖層、底圖三支，沒有 Drupal 或 proxy 請求
    expect(fetchMock).toHaveBeenCalledTimes(3)
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
    const layers = dgw.loadGisData()
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
      imgSrc: 'https://media.test/doc-1.jpg',
      link: 'https://page.test/doc-1/',
      ref: '撰稿者：林炯任',
    })
    expect(walkCallsOf(fetchMock)).toHaveLength(1)
  })

  it('getSceneDetailArticle 直接讀點到的 feature，並套用傳入的語系', async () => {
    mockFetch()
    const dgw = createDgw()
    await dgw.loadGisData()
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
    await dgw.loadGisData()
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
    await dgw.loadGisData()
    expect(await dgw.getSceneArticles()).toEqual([])
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
