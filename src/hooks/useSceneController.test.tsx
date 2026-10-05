import { act, render } from '@testing-library/react'
import React from 'react'
import { latLng } from 'leaflet'
import { JSDCContext } from '../JSDC/Context'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import { SceneFeature, SceneProperties } from '../JSDC/Dguidewalks/ApiProvider'
import {
  createSceneLayer,
  findSceneById,
  getSceneMarkers,
} from '../JSDC/Dguidewalks/scene'
import Event from '../JSDC/utils/Event'
import useSceneController, {
  DEFAULT_SCENE_TARGET_ZOOM,
  SceneConfig,
  SceneController,
} from './useSceneController'

// 這裡只測定位與導航，不需要真的 i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'zh-TW' } }),
}))

const scene = (
  id: string,
  title: string,
  coordinates: [number, number] | null,
): SceneFeature => ({
  type: 'Feature',
  id,
  geometry: coordinates && { type: 'Point', coordinates },
  properties: { title, category: null, legacyGisId: null } as SceneProperties,
})

// title 互相包含、甚至完全相同：用 title 比對一定會配到排在前面的那個
const street = scene('doc-street', '01老街', [121.28, 24.88])
const entrance = scene('doc-entrance', '01老街入口', [121.29, 24.89])
const twin = scene('doc-twin', '01老街', [121.3, 24.9])
const noGeometry = scene('doc-nowhere', '01老街入口廣場', null)
const features = [street, entrance, twin, noGeometry]

const setup = (hasGps = true, config: SceneConfig = {}) => {
  const userLatLng = hasGps ? latLng(24.8, 121.2) : undefined
  const markers = getSceneMarkers(createSceneLayer(features))
  const findSceneByTitle = jest.fn()
  const dgw = {
    eventId: 'n0004',
    gisDataLoadEvent: new Event(),
    sceneLayer: undefined,
    findSceneById: (id: string) => findSceneById(markers, id),
    findSceneByTitle,
  }
  const flyTo = jest.fn()
  const Jsdc = { viewer: { flyTo }, asyncViewer: new Promise(() => undefined) }
  const ref: { current?: SceneController } = {}

  const Probe = () => {
    ref.current = useSceneController({ deepLink: false, ...config })
    return null
  }
  render(
    <JSDCContext.Provider value={{ Jsdc, layerInfos: [] } as any}>
      <DguidewalksContext.Provider
        value={{ dgw, geolocation: { latLng: userLatLng } } as any}
      >
        <Probe />
      </DguidewalksContext.Provider>
    </JSDCContext.Provider>,
  )
  return { controller: ref.current!, flyTo, findSceneByTitle }
}

describe('useSceneController 的定位與導航', () => {
  let openSpy: jest.SpyInstance
  let alertSpy: jest.SpyInstance

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined)
  })

  afterEach(() => {
    openSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it.each([
    ['01老街', street, [24.88, 121.28]],
    ['01老街入口（title 包含另一個景點的 title）', entrance, [24.89, 121.29]],
    ['01老街（title 與另一個景點完全相同）', twin, [24.9, 121.3]],
  ] as Array<[string, SceneFeature, [number, number]]>)(
    '定位：%s 飛到自己的座標',
    (_name, feature, [lat, lng]) => {
      const { controller, flyTo, findSceneByTitle } = setup()
      controller.flyToScene(feature)
      expect(flyTo).toHaveBeenCalledTimes(1)
      const [target, zoom] = flyTo.mock.calls[0]
      expect([target.lat, target.lng]).toEqual([lat, lng])
      expect(zoom).toBe(DEFAULT_SCENE_TARGET_ZOOM)
      expect(findSceneByTitle).not.toHaveBeenCalled()
    },
  )

  it.each([
    ['01老街', street, '24.88,121.28'],
    ['01老街入口', entrance, '24.89,121.29'],
    ['01老街（同名）', twin, '24.9,121.3'],
  ] as Array<[string, SceneFeature, string]>)(
    '導航：%s 的目的地是自己的座標',
    (_name, feature, destination) => {
      const { controller, findSceneByTitle } = setup()
      controller.navigateToScene(feature)
      expect(openSpy).toHaveBeenCalledTimes(1)
      expect(openSpy.mock.calls[0][0]).toContain(
        `/maps/dir/24.8,121.2/${destination}/`,
      )
      expect(findSceneByTitle).not.toHaveBeenCalled()
    },
  )

  it('沒有座標的景點：定位、導航都不做事', () => {
    const { controller, flyTo } = setup()
    controller.flyToScene(noGeometry)
    controller.navigateToScene(noGeometry)
    expect(flyTo).not.toHaveBeenCalled()
    expect(openSpy).not.toHaveBeenCalled()
    expect(alertSpy).not.toHaveBeenCalled()
  })

  it('還沒有 GPS 位置時導航只提示，不開 Google Maps', () => {
    const { controller } = setup(false)
    controller.navigateToScene(entrance)
    expect(alertSpy).toHaveBeenCalledWith('尚未取得GPS位置')
    expect(openSpy).not.toHaveBeenCalled()
  })

  const postMessage = (data: unknown) =>
    act(() => {
      window.dispatchEvent(new MessageEvent('message', { data }))
    })

  it("集章 iframe 傳 'lng,lat' 回來：從使用者位置步行導航到該座標", () => {
    setup()
    postMessage('121.29,24.89')
    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(openSpy.mock.calls[0][0]).toContain('/24.8,121.2/24.89,121.29/')
  })

  it('格式不對的 message 不做事，也不提示', () => {
    setup()
    postMessage({ type: 'webpackOk' })
    postMessage('hello')
    expect(openSpy).not.toHaveBeenCalled()
    expect(alertSpy).not.toHaveBeenCalled()
  })

  it('navigationMessage: false 時不監聽', () => {
    setup(true, { navigationMessage: false })
    postMessage('121.29,24.89')
    expect(openSpy).not.toHaveBeenCalled()
  })
})
