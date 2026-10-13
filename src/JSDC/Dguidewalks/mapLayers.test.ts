import { WalkGeoJSONLayer } from './ApiProvider'
import createGeoJSONLayer from './createLayer/createGeoJSONLayer'
import JSDCLayer from '../Layer/JSDCLayer'
import {
  DEFAULT_PATH_COLOR,
  GeoJSONOverlayLayer,
  getPathColorItems,
  keepGeoJSONStackOrder,
  resolveLayerDefaults,
  sortByLayerNameOrder,
} from './mapLayers'

const line = (properties: object | null, type = 'LineString') => ({
  type: 'Feature',
  properties,
  geometry:
    type === 'LineString'
      ? {
          type,
          coordinates: [
            [121.28, 24.88],
            [121.29, 24.89],
          ],
        }
      : {
          type,
          coordinates: [
            [
              [121.28, 24.88],
              [121.29, 24.89],
            ],
          ],
        },
})

const polygon = (properties: object) => ({
  type: 'Feature',
  properties,
  geometry: {
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
})

const overlayLayer = (
  overlay: Partial<WalkGeoJSONLayer>,
  features: object[],
): GeoJSONOverlayLayer => {
  const config: WalkGeoJSONLayer = {
    name: 'line',
    type: 'geojson',
    url: '/line.geojson',
    ...overlay,
  }
  return {
    overlay: config,
    layer: createGeoJSONLayer(config, {
      type: 'FeatureCollection',
      features,
    } as any),
  }
}

describe('getPathColorItems（路線顏色清單）', () => {
  const styleBy = {
    prop: 'name',
    styles: {
      路線01: { color: '#C424F4' },
      路線02: { color: '#312531' },
    },
  }

  it('每個線段一列：名稱取 properties[styleBy.prop]，顏色取 styleBy，對不上用 style.color', () => {
    const items = getPathColorItems([
      overlayLayer({ style: { color: '#000000' }, styleBy }, [
        line({ name: '路線01' }),
        line({ name: '路線02' }, 'MultiLineString'),
        line({ name: '其他路線' }),
      ]),
    ])
    expect(items).toEqual([
      { name: '路線01', label: '路線01', color: '#C424F4' },
      { name: '路線02', label: '路線02', color: '#312531' },
      { name: '其他路線', label: '其他路線', color: '#000000' },
    ])
  })

  it('styleBy.prop 不是 name 時照 prop 取；沒有 styleBy 時用 properties.name 與 style.color', () => {
    expect(
      getPathColorItems([
        overlayLayer(
          {
            style: { color: '#111111' },
            styleBy: { prop: 'kind', styles: { 1: { color: '#4aca69' } } },
          },
          [line({ name: '不看這個', kind: 1 })],
        ),
        overlayLayer({ name: 'plain', style: { color: '#61ab58' } }, [
          line({ name: '大溪走讀路線' }),
        ]),
      ]),
    ).toEqual([
      { name: '1', label: '1', color: '#4aca69' },
      { name: '大溪走讀路線', label: '大溪走讀路線', color: '#61ab58' },
    ])
  })

  it('同名同色的合併成一列；同名不同色各自一列', () => {
    const items = getPathColorItems([
      overlayLayer({ style: { color: '#61ab58' } }, [
        line({ name: 'Line 9' }),
        line({ name: 'Line 9' }),
        line({ name: 'Line 13' }),
      ]),
      overlayLayer({ name: 'second', style: { color: '#61ab58' } }, [
        line({ name: 'Line 9' }),
      ]),
      overlayLayer({ name: 'third', style: { color: '#ff0000' } }, [
        line({ name: 'Line 9' }),
      ]),
    ])
    expect(items.map((item) => [item.name, item.color])).toEqual([
      ['Line 9', '#61ab58'],
      ['Line 13', '#61ab58'],
      ['Line 9', '#ff0000'],
    ])
  })

  it('沒有名稱的線段不列', () => {
    expect(
      getPathColorItems([
        overlayLayer({ style: { color: '#61ab58' } }, [
          line({ name: null }),
          line({ name: '' }),
          line({}),
          line(null),
          line({ name: '有名稱' }),
        ]),
      ]).map((item) => item.name),
    ).toEqual(['有名稱'])
  })

  it('面圖層不列，即使有 styleBy（判斷看 geometry.type，不看圖層名稱）', () => {
    expect(
      getPathColorItems([
        overlayLayer(
          {
            name: 's0004-line',
            styleBy: { prop: 'name', styles: { 甲區: { color: '#e59ab3' } } },
          },
          [polygon({ name: '甲區' })],
        ),
        overlayLayer({ name: '名稱沒有 line', style: { color: '#61ab58' } }, [
          line({ name: '路線' }),
        ]),
      ]),
    ).toEqual([{ name: '路線', label: '路線', color: '#61ab58' }])
  })

  it('語系是 en 且線段有 nameEn 時顯示 nameEn，否則顯示名稱', () => {
    const layers = [
      overlayLayer({ style: { color: '#000000' }, styleBy }, [
        line({ name: '路線01', nameEn: 'Hsinchu chip walk 01' }),
        line({ name: '路線02' }),
      ]),
    ]
    expect(getPathColorItems(layers, 'en').map((item) => item.label)).toEqual([
      'Hsinchu chip walk 01',
      '路線02',
    ])
    expect(
      getPathColorItems(layers, 'en-US').map((item) => item.label),
    ).toEqual(['Hsinchu chip walk 01', '路線02'])
    expect(
      getPathColorItems(layers, 'zh-TW').map((item) => item.label),
    ).toEqual(['路線01', '路線02'])
    // name 一律是原文，顏色照原文比對
    expect(getPathColorItems(layers, 'en')[0]).toEqual({
      name: '路線01',
      label: 'Hsinchu chip walk 01',
      color: '#C424F4',
    })
  })

  it('完全沒有指定顏色時用 Leaflet 的預設線色', () => {
    expect(
      getPathColorItems([overlayLayer({}, [line({ name: '路線' })])]),
    ).toEqual([{ name: '路線', label: '路線', color: DEFAULT_PATH_COLOR }])
  })
})

describe('resolveLayerDefaults（相容 prop 疊加在 mapConfig 之上）', () => {
  const description = (name: string, visible: boolean, listed: boolean) => ({
    name,
    type: 'image',
    visible,
    listed,
  })

  it('不傳相容 prop 時完全照 mapConfig', () => {
    expect(resolveLayerDefaults(description('底圖', true, true))).toEqual({
      show: true,
      hidden: false,
    })
    expect(resolveLayerDefaults(description('路線', true, false))).toEqual({
      show: true,
      hidden: true,
    })
    expect(resolveLayerDefaults(description('縣界', false, true))).toEqual({
      show: false,
      hidden: false,
    })
  })

  it('layersShowOnMapByDefault 只會多顯示，不會把 mapConfig 要顯示的關掉', () => {
    const options = { layersShowOnMapByDefault: ['縣界'] }
    expect(
      resolveLayerDefaults(description('縣界', false, true), options).show,
    ).toBe(true)
    expect(
      resolveLayerDefaults(description('底圖', true, true), options).show,
    ).toBe(true)
    expect(
      resolveLayerDefaults(description('航照', false, true), options).show,
    ).toBe(false)
  })

  it('layersHiddenFromUI 只會多隱藏，不會把 mapConfig 不列的列出來', () => {
    const options = { layersHiddenFromUI: ['航照'] }
    expect(
      resolveLayerDefaults(description('航照', false, true), options).hidden,
    ).toBe(true)
    expect(
      resolveLayerDefaults(description('路線', true, false), options).hidden,
    ).toBe(true)
    expect(
      resolveLayerDefaults(description('底圖', true, true), options).hidden,
    ).toBe(false)
  })
})

describe('keepGeoJSONStackOrder', () => {
  it('面在下、線在上，同一種之間照陣列順序；圖層開關後重排，只動顯示中的圖層', () => {
    const order: string[] = []
    const make = (name: string, features: object[], show = true) => {
      const { layer } = overlayLayer({ name }, features)
      // 沒有地圖時 show 讀的是 _show，先設好初始狀態
      layer.show = show
      layer.instance!.bringToFront = () => {
        order.push(name)
        return layer.instance!
      }
      return layer as JSDCLayer
    }
    const lineA = make('line-a', [line({ name: 'a' })])
    const polygonA = make('polygon-a', [polygon({ name: 'a' })])
    const polygonB = make('polygon-b', [polygon({ name: 'b' })], false)
    const lineB = make('line-b', [line({ name: 'b' })])

    const stop = keepGeoJSONStackOrder([lineA, polygonA, polygonB, lineB])
    expect(order).toEqual(['polygon-a', 'line-a', 'line-b'])

    order.length = 0
    polygonB.onToggleShowEvent.raise()
    expect(order).toEqual(['polygon-a', 'line-a', 'line-b'])

    order.length = 0
    stop()
    polygonB.onToggleShowEvent.raise()
    expect(order).toEqual([])
  })
})

describe('sortByLayerNameOrder（圖層清單順序）', () => {
  const info = (id: string, name: string) => ({ id, description: { name } })
  const idsOf = (items: Array<{ id: string }>) => items.map((item) => item.id)
  const infos = [
    info('1', '甲'),
    info('2', '乙'),
    info('3', '甲'),
    info('4', '丙'),
    info('5', '丁'),
  ]

  it('沒有 layerNameOrder 時維持原順序', () => {
    expect(idsOf(sortByLayerNameOrder(infos))).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ])
    expect(idsOf(sortByLayerNameOrder(infos, []))).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ])
  })

  it('列到的照 layerNameOrder 的順序排前面，沒列到的維持原順序排後面', () => {
    expect(idsOf(sortByLayerNameOrder(infos, ['丁', '乙', '不存在']))).toEqual([
      '5',
      '2',
      '1',
      '3',
      '4',
    ])
  })

  it('同名的圖層都保留，不會被吃掉', () => {
    expect(idsOf(sortByLayerNameOrder(infos, ['丙', '甲']))).toEqual([
      '4',
      '1',
      '3',
      '2',
      '5',
    ])
    expect(sortByLayerNameOrder(infos, ['甲'])).toHaveLength(infos.length)
  })

  it('不改動傳入的陣列', () => {
    const copy = [...infos]
    sortByLayerNameOrder(infos, ['丁'])
    expect(infos).toEqual(copy)
  })
})
