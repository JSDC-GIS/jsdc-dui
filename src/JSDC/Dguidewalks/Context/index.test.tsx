import { render, waitFor } from '@testing-library/react'
import React, { useContext } from 'react'
import { Layer } from 'leaflet'
import Dguidewalks, { SCENE_LAYER_NAME } from '..'
import ConfigProvider from '../ConfigProvider'
import LayerController from '../../Controller/LayerController'
import { DguidewalksContext, IDguidewalksProviderProps } from '.'
import { DguidewalksProvider } from '.'

const line = (name: string) => ({
  type: 'Feature',
  properties: { name },
  geometry: {
    type: 'LineString',
    coordinates: [
      [121.28, 24.88],
      [121.29, 24.89],
    ],
  },
})

const polygon = (name: string) => ({
  type: 'Feature',
  properties: { name },
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

const geojsonFiles: Record<string, object> = {
  '/map-data/line.geojson': {
    type: 'FeatureCollection',
    features: [line('a')],
  },
  '/map-data/area.geojson': {
    type: 'FeatureCollection',
    features: [polygon('a')],
  },
}

const defaultMapConfig = {
  baseLayers: [
    { name: '正射影像', url: 'https://tile.test/photo/{z}' },
    { name: '電子地圖', url: 'https://tile.test/emap/{z}', default: true },
  ],
  overlays: [
    { name: '堡圖', url: 'https://tile.test/old/{z}' },
    {
      name: '路線',
      type: 'geojson',
      url: '/map-data/line.geojson',
      visible: true,
      listed: false,
    },
    { name: '縣界', type: 'geojson', url: '/map-data/area.geojson' },
  ],
}

const walkOf = (mapConfig: unknown) => ({
  code: 'n0004',
  mapConfig,
  pois: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'doc-1',
        geometry: { type: 'Point', coordinates: [121.28, 24.88] },
        properties: { title: '01老街', category: null, legacyGisId: null },
      },
    ],
  },
})

type Walk = 'ok' | 'http-error'

const mockFetch = (mapConfig: unknown, walk: Walk) => {
  ;(global as any).fetch = jest.fn(async (url: string) => {
    const json = (body: unknown, ok = true, status = 200) => ({
      ok,
      status,
      json: async () => body,
    })
    if (url.includes('/walks/')) {
      return walk === 'ok' ? json(walkOf(mapConfig)) : json({}, false, 500)
    }
    const file = geojsonFiles[new URL(url).pathname]
    return file ? json(file) : json({}, false, 404)
  })
}

// 只做 LayerController 與 JSDCLayer 會用到的部分：記錄哪些 Leaflet 圖層在地圖上。
// jsdom 沒有 SVG / canvas renderer，真的 Leaflet Map 加不了向量圖層。
const createFakeViewer = () => {
  const onMap = new Set<Layer>()
  const viewer = {
    addLayer: (layer: Layer) => {
      onMap.add(layer)
      ;(layer as any)._map = viewer
      return viewer
    },
    removeLayer: (layer: Layer) => {
      onMap.delete(layer)
      return viewer
    },
    hasLayer: (layer: Layer) => onMap.has(layer),
  }
  return viewer
}

type SetupOptions = Partial<
  Pick<
    IDguidewalksProviderProps,
    'layersShowOnMapByDefault' | 'layersHiddenFromUI'
  >
> & {
  mapConfig?: unknown
  walk?: Walk
  /** 拿到 dgw 之後、圖層載入完成之前呼叫（用來先掛監聽）。 */
  onDgw?: (dgw: Dguidewalks) => void
}

const setup = ({
  mapConfig = defaultMapConfig,
  walk = 'ok',
  onDgw,
  ...props
}: SetupOptions = {}) => {
  mockFetch(mapConfig, walk)
  const layerController = new LayerController('Layer')
  layerController.init(createFakeViewer() as any)
  const Jsdc = { Controller: { get: () => layerController } }
  const ref: { dgw?: Dguidewalks } = {}
  const onNewName = jest.fn()
  const onOldName = jest.fn()
  const Probe = () => {
    const { dgw } = useContext(DguidewalksContext)
    if (!ref.dgw) {
      ref.dgw = dgw
      dgw.dataLoadEvent.addEventListener(onNewName)
      dgw.gisDataLoadEvent.addEventListener(onOldName)
      onDgw?.(dgw)
    }
    return null
  }
  const view = render(
    <DguidewalksProvider
      Jsdc={Jsdc as any}
      config={new ConfigProvider({ eventId: 'n0004' })}
      {...props}
    >
      <Probe />
    </DguidewalksProvider>,
  )
  const shown = () =>
    layerController.layers.values
      .filter((layer) => layer.show)
      .map((layer) => layer.description.name)
  const listed = () =>
    layerController.layerInfos.map((info) => info.description.name)
  const loaded = () => waitFor(() => expect(onNewName).toHaveBeenCalled())
  return {
    ...view,
    dgw: ref.dgw!,
    layerController,
    shown,
    listed,
    loaded,
    onNewName,
    onOldName,
  }
}

describe('DguidewalksProvider 的圖層接線', () => {
  let errorSpy: jest.SpyInstance
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    ;(navigator as any).geolocation = { watchPosition: jest.fn() }
  })

  afterEach(() => {
    errorSpy.mockRestore()
    warnSpy.mockRestore()
    delete (global as any).fetch
    delete (navigator as any).geolocation
  })

  it('不傳相容 prop：default / visible 決定顯示，listed 決定清單，景點顯示但不列', async () => {
    const { shown, listed, loaded } = setup()
    await loaded()
    expect(shown()).toEqual(['電子地圖', '路線', SCENE_LAYER_NAME])
    expect(listed()).toEqual(['正射影像', '電子地圖', '堡圖', '縣界'])
  })

  it('layersShowOnMapByDefault 加在 mapConfig 之上：多顯示，不會關掉原本要顯示的', async () => {
    const { shown, listed, loaded } = setup({
      layersShowOnMapByDefault: ['縣界', '不存在的圖層'],
    })
    await loaded()
    expect(shown()).toEqual(['電子地圖', '路線', '縣界', SCENE_LAYER_NAME])
    expect(listed()).toEqual(['正射影像', '電子地圖', '堡圖', '縣界'])
  })

  it('layersHiddenFromUI 加在 mapConfig 之上：多隱藏，不影響顯示', async () => {
    const { shown, listed, loaded } = setup({
      layersHiddenFromUI: ['堡圖', '電子地圖'],
    })
    await loaded()
    expect(listed()).toEqual(['正射影像', '縣界'])
    expect(shown()).toEqual(['電子地圖', '路線', SCENE_LAYER_NAME])
  })

  it('載入完成後發 dataLoadEvent 一次，掛在舊別名 gisDataLoadEvent 的監聽也會被觸發', async () => {
    const { dgw, loaded, onNewName, onOldName } = setup()
    await loaded()
    expect(onNewName).toHaveBeenCalledTimes(1)
    expect(onOldName).toHaveBeenCalledTimes(1)
    // 事件發出時圖層已經建好
    expect(dgw.sceneLayer).toBeDefined()
    expect(dgw.geoJSONOverlayLayers).toHaveLength(2)
  })

  it('mapConfig 壞掉（不是陣列）時仍發 dataLoadEvent，景點照常', async () => {
    const { dgw, shown, listed, loaded, onOldName } = setup({
      mapConfig: { baseLayers: 'oops', overlays: { name: 'x' } },
    })
    await loaded()
    expect(onOldName).toHaveBeenCalledTimes(1)
    expect(shown()).toEqual([SCENE_LAYER_NAME])
    expect(listed()).toEqual([])
    expect(dgw.findSceneById('doc-1')).toBeDefined()
  })

  it('walk 請求失敗時仍發 dataLoadEvent', async () => {
    const { layerController, loaded, onNewName } = setup({ walk: 'http-error' })
    await loaded()
    expect(onNewName).toHaveBeenCalledTimes(1)
    expect(layerController.layers.values).toEqual([])
    // React 自己的警告也會走 console.error，只數 walk 的那一筆
    expect(
      errorSpy.mock.calls.filter(([message]) =>
        String(message).startsWith('[walk api]'),
      ),
    ).toHaveLength(1)
  })

  it('建圖層的過程丟例外時仍發 dataLoadEvent，並記錄錯誤', async () => {
    const { loaded, onNewName } = setup({
      onDgw: (dgw) => {
        dgw.loadMapData = async () => {
          throw new Error('boom')
        }
      },
    })
    await loaded()
    expect(onNewName).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith(
      '[map data]: failed to initialize map layers',
      expect.any(Error),
    )
  })

  it('unmount 時解除疊放順序的監聽，不殘留', async () => {
    const { dgw, loaded, unmount } = setup()
    await loaded()
    const layers = dgw.geoJSONOverlayLayers.map(({ layer }) => layer)
    const calls: string[] = []
    layers.forEach((layer) => {
      layer.instance!.bringToFront = () => {
        calls.push(layer.description.name)
        return layer.instance!
      }
    })
    // 掛著的時候，開關圖層會重排（面在下、線在上；只動顯示中的）
    layers[1].show = true
    expect(calls).toEqual(['縣界', '路線'])

    unmount()
    // cleanup 等 init 的 promise 才解除監聽，所以用 waitFor
    await waitFor(() => {
      calls.length = 0
      layers[1].onToggleShowEvent.raise()
      expect(calls).toEqual([])
    })
  })

  it('載入完成前就 unmount：不加圖層、不發事件', async () => {
    const { layerController, onNewName, unmount } = setup()
    unmount()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(onNewName).not.toHaveBeenCalled()
    expect(layerController.layers.values).toEqual([])
  })
})
