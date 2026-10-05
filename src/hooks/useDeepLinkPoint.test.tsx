import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { JSDCContext } from '../JSDC/Context'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import { SceneFeature, SceneProperties } from '../JSDC/Dguidewalks/ApiProvider'
import {
  SceneMarker,
  createSceneLayer,
  findSceneById,
  getSceneMarkers,
} from '../JSDC/Dguidewalks/scene'
import Event from '../JSDC/utils/Event'
import useDeepLinkPoint, { UseDeepLinkPointOptions } from './useDeepLinkPoint'

const scene = (
  id: string,
  legacyGisId: string | null,
  coordinates: [number, number],
): SceneFeature => ({
  type: 'Feature',
  id,
  geometry: { type: 'Point', coordinates },
  properties: { title: id, category: null, legacyGisId } as SceneProperties,
})

// 只做 hook 會用到的部分：景點查找、載入事件、地圖的 flyTo / moveend
const setup = (search: string, options: Partial<UseDeepLinkPointOptions>) => {
  window.history.pushState({}, '', `/n0004/${search}`)
  const markers = getSceneMarkers(
    createSceneLayer([
      scene('doc-1', 'gis-uuid-1', [121.28, 24.88]),
      scene('doc-2', null, [121.29, 24.89]),
    ]),
  )
  const gisDataLoadEvent = new Event()
  const dgw = {
    gisDataLoadEvent,
    sceneLayer: undefined,
    findSceneById: (id: string) => findSceneById(markers, id),
  }
  const map = {
    flyTo: jest.fn(),
    once: jest.fn((_type: string, callback: () => void) => callback()),
  }
  const Jsdc = { asyncViewer: Promise.resolve(map) }
  const onResolve = jest.fn<void, [SceneMarker]>()

  const Probe = () => {
    useDeepLinkPoint({ onResolve, delayMs: 0, ...options })
    return null
  }
  render(
    <JSDCContext.Provider value={{ Jsdc, layerInfos: [] } as any}>
      <DguidewalksContext.Provider value={{ dgw } as any}>
        <Probe />
      </DguidewalksContext.Provider>
    </JSDCContext.Provider>,
  )
  return { gisDataLoadEvent, map, onResolve }
}

describe('useDeepLinkPoint', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('?id= 是 Strapi documentId', async () => {
    const { gisDataLoadEvent, map, onResolve } = setup('?id=doc-2', {})
    gisDataLoadEvent.raise()
    await waitFor(() => expect(onResolve).toHaveBeenCalledTimes(1))
    expect(onResolve.mock.calls[0][0].feature.id).toBe('doc-2')
    const [latLng, zoom, flyOptions] = map.flyTo.mock.calls[0]
    expect([latLng.lat, latLng.lng]).toEqual([24.89, 121.29])
    expect(zoom).toBe(17)
    expect(flyOptions).toEqual({ duration: 4 })
  })

  it('?id= 是舊的 GIS UUID（legacyGisId），舊連結繼續有效', async () => {
    const { gisDataLoadEvent, onResolve } = setup('?id=gis-uuid-1', {})
    gisDataLoadEvent.raise()
    await waitFor(() => expect(onResolve).toHaveBeenCalledTimes(1))
    expect(onResolve.mock.calls[0][0].feature.id).toBe('doc-1')
  })

  it('paramKey、flyToZoom 可以調整', async () => {
    const { gisDataLoadEvent, map, onResolve } = setup('?poi=doc-1', {
      paramKey: 'poi',
      flyToZoom: 19,
    })
    gisDataLoadEvent.raise()
    await waitFor(() => expect(onResolve).toHaveBeenCalledTimes(1))
    expect(map.flyTo.mock.calls[0][1]).toBe(19)
  })

  it('資料載入前不處理；找不到 id 只警告', async () => {
    const { gisDataLoadEvent, map, onResolve } = setup('?id=nope', {})
    expect(map.flyTo).not.toHaveBeenCalled()
    gisDataLoadEvent.raise()
    await waitFor(() => expect(warnSpy).toHaveBeenCalledTimes(1))
    expect(map.flyTo).not.toHaveBeenCalled()
    expect(onResolve).not.toHaveBeenCalled()
  })

  it('沒有 ?id= 或 enabled 為 false 時不動作', async () => {
    const plain = setup('', {})
    plain.gisDataLoadEvent.raise()
    const disabled = setup('?id=doc-1', { enabled: false })
    disabled.gisDataLoadEvent.raise()
    await Promise.resolve()
    expect(plain.map.flyTo).not.toHaveBeenCalled()
    expect(disabled.map.flyTo).not.toHaveBeenCalled()
  })
})
