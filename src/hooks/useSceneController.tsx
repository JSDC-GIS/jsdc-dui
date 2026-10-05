import { useContext, useEffect, useRef, useState } from 'react'
import { LeafletEvent } from 'leaflet'
import { useTranslation } from 'react-i18next'
import { JSDCContext } from '../JSDC/Context'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import { SceneFeature } from '../JSDC/Dguidewalks/ApiProvider'
import { DetailArticleType } from '../JSDC/Dguidewalks/proxyParser/@types'
import {
  DEFAULT_SCENE_VALID_DISTANCE,
  SceneMarker,
  getSceneCheckinKey,
  getSceneCheckinName,
  getSceneCheckinSrc,
  getSceneLatLng,
  getSceneMarkers,
  getSceneShareUrl,
  getSceneValidDistance,
  parseSceneNavigationMessage,
} from '../JSDC/Dguidewalks/scene'
import type { ICheckInCardProps } from '../components/LeafletPopup/CheckInCard'
import useDeepLinkPoint, { UseDeepLinkPointOptions } from './useDeepLinkPoint'
import useGoogleNavigator from './useGoogleNavigator'

export type SceneCheckinSrcBuilder = (context: {
  eventId: string
  feature: SceneFeature
  /** 集章用的點名（`legacyName ?? title`）。 */
  name: string
  /** `btoa(encodeURI('{eventId}:{name}'))`。 */
  key: string
}) => string

export type SceneDeepLinkConfig = Omit<
  UseDeepLinkPointOptions,
  'onResolve' | 'enabled'
>

/**
 * 景點圖層的內建行為設定。全部選填，預設值就是下游原本各自複製的那套標準寫法：
 * 點 marker 開集章卡片、cluster、`?id=` 深連結、列表的定位與導航。
 */
export type SceneConfig = {
  /** 景點是否做 cluster。預設 true。 */
  cluster?: boolean
  /** 集章的有效距離（公尺）。預設 100；不限距離傳 `Infinity`。網址帶 `#debug` 時一律不限。 */
  validDistance?: number
  /** 景點列表定位鈕飛過去的縮放層級。預設 18.5。 */
  targetZoom?: number
  /** 自訂集章 iframe 網址。預設 `https://map.jsdc.com.tw/tools/checkin/{eventId}/ci.php?s={key}`。 */
  checkinSrc?: SceneCheckinSrcBuilder
  /** 集章 iframe 對話框上方的主視覺圖。 */
  checkinKanbanImgSrc?: string
  /** 卡片是否顯示分享鈕（複製 `?id={documentId}` 連結）。預設 true。 */
  share?: boolean
  /** `?id=` 深連結。預設開啟；傳 false 關閉，或傳物件調整參數。 */
  deepLink?: boolean | SceneDeepLinkConfig
  /** 集章 iframe 用 postMessage 傳 `'lng,lat'` 回來時，是否開 Google 步行導航。預設 true。 */
  navigationMessage?: boolean
  /**
   * 覆寫景點被點擊（或由深連結解析到）時的行為。
   * `openDefault()` 會開內建的集章卡片，可以在前後加自己的邏輯，或完全不呼叫。
   */
  onSceneClick?: (marker: SceneMarker, openDefault: () => void) => void
}

export const DEFAULT_SCENE_TARGET_ZOOM = 18.5

const useSceneController = (config: SceneConfig = {}) => {
  const { Jsdc } = useContext(JSDCContext)
  // DuiContextProvider 若被放在 DguidewalksProvider 外面，dgw 會是 undefined；
  // 這時內建行為全部不作用，但不能讓整個畫面壞掉。
  const { dgw, geolocation } = useContext(DguidewalksContext)
  const { i18n } = useTranslation()
  const { walkTo } = useGoogleNavigator()

  const [marker, setMarker] = useState<SceneMarker>()
  // 內文要記住它屬於哪個景點：同一個景點被再開一次時（例如深連結延遲開卡片前，
  // 使用者已經先點了同一個 marker），marker 沒變、抓內文的 effect 不會重跑，
  // 如果開卡片時先把內文清掉，卡片就會永遠停在 loading。
  const [detailState, setDetailState] = useState<{
    id: string
    detail: DetailArticleType
  }>()
  const detail =
    marker && detailState?.id === marker.feature.id
      ? detailState.detail
      : undefined
  const [checkinSrc, setCheckinSrc] = useState<string>()
  const [debugUrl, setDebugUrl] = useState(() => window.location.href)

  // 換景點時內文對不上 id，卡片自然顯示 placeholder，不需要在這裡清
  const openSceneCard = (target: SceneMarker) => setMarker(target)
  const closeSceneCard = () => setMarker(undefined)
  const closeCheckin = () => setCheckinSrc(undefined)

  const handleSceneClick = (target: SceneMarker) => {
    const openDefault = () => openSceneCard(target)
    config.onSceneClick
      ? config.onSceneClick(target, openDefault)
      : openDefault()
  }
  // marker 的 click 只綁一次，用 ref 才拿得到最新的設定
  const handleSceneClickRef = useRef(handleSceneClick)
  handleSceneClickRef.current = handleSceneClick

  // 內文依語系擇一，卡片開著時切換語言要跟著換
  useEffect(() => {
    if (!marker || !dgw) return
    let cancelled = false
    const { feature } = marker
    dgw
      .getSceneDetailArticle(feature, i18n.language)
      .catch((error) => {
        // 下游自帶的舊 parser 可能查不到這個 title；卡片仍要能開、能集章
        console.warn('[scene]: failed to get scene article', error)
        const { title, pageUrl } = feature.properties
        return {
          title,
          subtitle: '',
          content: '',
          imgSrc: '',
          link: pageUrl,
          ref: '',
        }
      })
      .then(
        (result) =>
          cancelled || setDetailState({ id: feature.id, detail: result }),
      )
    return () => {
      cancelled = true
    }
  }, [marker, i18n.language])

  useEffect(() => {
    if (!dgw) return
    let markers: SceneMarker[] = []
    const onClick = (event: LeafletEvent) =>
      handleSceneClickRef.current(event.target as SceneMarker)
    const unbind = () => markers.forEach((item) => item.off('click', onClick))
    const bind = () => {
      unbind()
      markers = getSceneMarkers(dgw.sceneLayer)
      markers.forEach((item) => item.on('click', onClick))
    }
    // 景點圖層可能已經載完（事件早就發過）
    dgw.sceneLayer && bind()
    const removeListener = dgw.gisDataLoadEvent.addEventListener(bind)
    return () => {
      removeListener()
      unbind()
    }
  }, [dgw])

  useEffect(() => {
    const onHashChange = () => setDebugUrl(window.location.href)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // message 只綁一次，使用者位置要用 ref 才拿得到最新的
  const userLatLngRef = useRef(geolocation?.latLng)
  userLatLngRef.current = geolocation?.latLng
  const navigationMessageEnabled = config.navigationMessage !== false
  useEffect(() => {
    if (!navigationMessageEnabled) return
    const onMessage = (event: MessageEvent) => {
      const destination = parseSceneNavigationMessage(event.data)
      destination && walkTo(userLatLngRef.current, destination)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigationMessageEnabled])

  useDeepLinkPoint({
    ...(typeof config.deepLink === 'object' ? config.deepLink : {}),
    enabled: config.deepLink !== false,
    onResolve: (target) => handleSceneClickRef.current(target),
  })

  // 定位與導航都直接讀傳進來的 feature，不用 title 回頭找 marker：
  // title 相同或互相包含的景點（「01老街」「01老街入口」）會配錯。
  // 沒有座標的景點（geometry 為 null）不在地圖上，兩者都不做事。
  const flyToScene = (feature: SceneFeature) => {
    const target = getSceneLatLng(feature)
    target &&
      Jsdc.viewer?.flyTo(target, config.targetZoom ?? DEFAULT_SCENE_TARGET_ZOOM)
  }

  const navigateToScene = (feature: SceneFeature) => {
    const destination = getSceneLatLng(feature)
    destination && walkTo(geolocation?.latLng, destination)
  }

  const buildCheckinSrc = (feature: SceneFeature) => {
    const eventId = dgw.eventId
    return config.checkinSrc
      ? config.checkinSrc({
          eventId,
          feature,
          name: getSceneCheckinName(feature),
          key: getSceneCheckinKey(eventId, feature),
        })
      : getSceneCheckinSrc(eventId, feature)
  }

  // 內文回來前給空物件，CheckInCard 會顯示自己的 placeholder
  const cardProps: Partial<ICheckInCardProps> =
    marker && detail
      ? {
          feature: marker.feature,
          sceneLatLng: marker.getLatLng(),
          validDistance: getSceneValidDistance(
            debugUrl,
            config.validDistance ?? DEFAULT_SCENE_VALID_DISTANCE,
          ),
          title: marker.feature.properties.title,
          checkinName: getSceneCheckinName(marker.feature),
          subtitle: detail.subtitle || '',
          imgSrc: detail.imgSrc,
          mainTextContent: detail.content,
          credit: detail.ref || '未知',
          checkinSrc: buildCheckinSrc(marker.feature),
          onCheckin: (src) => {
            setCheckinSrc(src)
            closeSceneCard()
            marker.closePopup()
          },
        }
      : {}

  return {
    config,
    /** 目前開著卡片的景點；沒開時為 undefined。 */
    marker,
    cardProps,
    shareUrl:
      marker && config.share !== false
        ? getSceneShareUrl(
            marker.feature,
            window.location,
            typeof config.deepLink === 'object'
              ? config.deepLink.paramKey
              : undefined,
          )
        : undefined,
    /** 集章 iframe 的網址；按下集章後才有值。 */
    checkinSrc,
    openSceneCard,
    closeSceneCard,
    closeCheckin,
    flyToScene,
    navigateToScene,
  }
}

export type SceneController = ReturnType<typeof useSceneController>

export default useSceneController
