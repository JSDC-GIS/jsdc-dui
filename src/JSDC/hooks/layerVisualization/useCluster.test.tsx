import { act, render, waitFor } from '@testing-library/react'
import { Map, Marker, MarkerClusterGroup } from 'leaflet'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import React from 'react'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'
import useCluster from './useCluster'

const point = (name: string, coordinates: [number, number]) => ({
  type: 'Feature' as const,
  geometry: { type: 'Point' as const, coordinates },
  properties: { name },
})

// jsdom 沒有版面，給地圖容器固定大小，markercluster 才算得出畫面範圍
const createMap = () => {
  const container = document.createElement('div')
  Object.defineProperty(container, 'clientWidth', { value: 1280 })
  Object.defineProperty(container, 'clientHeight', { value: 800 })
  document.body.appendChild(container)
  return new Map(container, {
    maxZoom: 18,
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false,
  }).setView([24.9, 121.4], 13)
}

// 兩個相距很遠的點（縮放 13 時各自是單點）加上兩個幾乎重疊的點（會聚合）
const createSourceLayer = () => {
  const layer = new JSDCGeoJSONLayer({ id: 'scene', description: {} as any })
  layer.addFeature(point('single-a', [121.36, 24.92]))
  layer.addFeature(point('single-b', [121.44, 24.88]))
  layer.addFeature(point('pair-1', [121.4, 24.9]))
  layer.addFeature(point('pair-2', [121.40001, 24.90001]))
  return layer
}

const markersOf = (layer: JSDCGeoJSONLayer) => {
  const markers: Record<string, Marker> = {}
  layer.forEachLayerAsGeoJSON<Marker, { name: string }>((marker, props) => {
    markers[props.name] = marker
  })
  return markers
}

const findCluster = (map: Map) => {
  let cluster: MarkerClusterGroup | undefined
  map.eachLayer((layer) => {
    if (layer instanceof MarkerClusterGroup) cluster = layer
  })
  return cluster
}

const setup = async () => {
  const map = createMap()
  let api!: ReturnType<typeof useCluster>
  const Probe = () => {
    api = useCluster(Promise.resolve(map))
    return null
  }
  render(<Probe />)
  await waitFor(() => expect(findCluster(map)).toBeDefined())
  return { map, getApi: () => api }
}

describe('useCluster', () => {
  it('來源圖層已經在地圖上時，addLayer 之後不需聚合的單點仍畫在地圖上', async () => {
    const { map, getApi } = await setup()
    const layer = createSourceLayer()
    layer.addToMap(map)
    const markers = markersOf(layer)
    expect(map.hasLayer(markers['single-a'])).toBe(true)

    act(() => getApi().addLayer(layer))

    // 來源圖層本身收起來，單點改由 cluster 畫
    expect(layer.show).toBe(false)
    expect(map.hasLayer(layer.instance!)).toBe(false)
    expect(map.hasLayer(markers['single-a'])).toBe(true)
    expect(map.hasLayer(markers['single-b'])).toBe(true)
    expect(document.body.contains(markers['single-a'].getElement()!)).toBe(true)
    // 重疊的兩點聚合成一個 cluster，不單獨畫
    expect(map.hasLayer(markers['pair-1'])).toBe(false)
    expect(map.hasLayer(markers['pair-2'])).toBe(false)
    expect(findCluster(map)!.getLayers()).toHaveLength(4)
  })

  it('來源圖層還沒加到地圖時，addLayer 一樣把單點畫出來', async () => {
    const { map, getApi } = await setup()
    const layer = createSourceLayer()
    const markers = markersOf(layer)

    act(() => getApi().addLayer(layer))

    expect(map.hasLayer(markers['single-a'])).toBe(true)
    expect(map.hasLayer(markers['single-b'])).toBe(true)
    expect(map.hasLayer(markers['pair-1'])).toBe(false)
  })

  // 重現載入時的情境：JSDC 建好地圖就 flyToBounds，景點在飛行途中才載完。
  // 飛行期間 Leaflet 不發 moveend，markercluster 的縮放層級與顯示範圍停在起飛時；
  // 飛行結束的 zoomend 只展開舊層級的 cluster，舊層級就已是單點、但不在起飛時範圍內的點不會被補畫。
  // jsdom 沒有 CSS 3D，flyTo 會直接跳到終點，所以用 Leaflet 飛行時發的事件模擬：
  // 起飛發 zoomstart／movestart，落地（setView）發 zoomend／moveend。
  it('地圖移動途中 addLayer，移動結束後不在起飛範圍內的單點仍畫在地圖上', async () => {
    const { map, getApi } = await setup()
    const cluster = findCluster(map)!
    const layer = new JSDCGeoJSONLayer({ id: 'scene', description: {} as any })
    // 終點附近的單點：縮放 13 時就是單點，且在起飛時（中心 121.4、縮放 13）的顯示範圍外
    layer.addFeature(point('far-single', [121.8, 24.9]))
    // 終點附近會聚合的兩點，確認聚合照常
    layer.addFeature(point('far-pair-1', [121.86, 24.93]))
    layer.addFeature(point('far-pair-2', [121.86001, 24.93001]))
    const markers = markersOf(layer)

    act(() => {
      map.fire('zoomstart').fire('movestart')
      getApi().addLayer(layer)
    })
    // 移動還沒結束時來源圖層已收起，避免未聚合的點閃一下
    expect(layer.show).toBe(false)
    // 移動結束前不加進 cluster
    expect(cluster.getLayers()).toHaveLength(0)

    act(() => {
      map.setView([24.9, 121.8], 14, { animate: false })
    })
    // 等 markercluster 的縮放動畫佇列跑完
    await act(() => new Promise((resolve) => setTimeout(resolve, 400)))

    expect(cluster.getLayers()).toHaveLength(3)
    expect(map.hasLayer(markers['far-single'])).toBe(true)
    expect(document.body.contains(markers['far-single'].getElement()!)).toBe(
      true,
    )
    expect(map.hasLayer(markers['far-pair-1'])).toBe(false)
    expect(map.hasLayer(markers['far-pair-2'])).toBe(false)
  })

  it('地圖沒有在移動時 addLayer 立即生效', async () => {
    const { map, getApi } = await setup()
    const layer = createSourceLayer()
    const markers = markersOf(layer)
    // 一次完整的移動（movestart → moveend）結束後，不應再延後
    act(() => {
      map.setView([24.9, 121.4], 13, { animate: false })
      getApi().addLayer(layer)
    })
    expect(map.hasLayer(markers['single-a'])).toBe(true)
  })

  it('toggleShowCluster 在 cluster 與來源圖層之間切換', async () => {
    const { map, getApi } = await setup()
    const layer = createSourceLayer()
    layer.addToMap(map)
    const markers = markersOf(layer)
    act(() => getApi().addLayer(layer))
    const cluster = findCluster(map)!

    await act(async () => {
      await getApi().toggleShowCluster()
    })
    expect(getApi().show).toBe(false)
    expect(map.hasLayer(cluster)).toBe(false)
    expect(layer.show).toBe(true)
    // 來源圖層直接畫出全部的點，包含原本被聚合的
    expect(map.hasLayer(markers['pair-1'])).toBe(true)

    await act(async () => {
      await getApi().toggleShowCluster()
    })
    await waitFor(() => expect(getApi().show).toBe(true))
    expect(map.hasLayer(cluster)).toBe(true)
    expect(layer.show).toBe(false)
    expect(map.hasLayer(markers['pair-1'])).toBe(false)
    // 切回 cluster 之後單點仍畫在地圖上
    expect(map.hasLayer(markers['single-a'])).toBe(true)
    expect(map.hasLayer(markers['single-b'])).toBe(true)
  })
})
