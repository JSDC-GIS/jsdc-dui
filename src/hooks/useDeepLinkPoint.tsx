import { useContext, useEffect, useRef } from 'react'
import { JSDCContext } from '../JSDC/Context'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import { SceneMarker } from '../JSDC/Dguidewalks/scene'

export interface UseDeepLinkPointOptions {
  onResolve: (marker: SceneMarker) => void
  paramKey?: string
  flyToZoom?: number
  flyToDuration?: number
  delayMs?: number
  /** false 時完全不處理深連結。hook 不能條件式呼叫，所以用參數關。 */
  enabled?: boolean
}

/**
 * 網址帶 `?id=` 時飛到該景點並回呼 `onResolve`。
 * id 用 `dgw.findSceneById` 解析，同時接受 Strapi documentId 與舊的 GIS UUID（`legacyGisId`），
 * 已經分享出去的舊連結才不會失效。
 */
const useDeepLinkPoint = ({
  onResolve,
  paramKey = 'id',
  flyToZoom = 17,
  flyToDuration = 4,
  delayMs = 1500,
  enabled = true,
}: UseDeepLinkPointOptions) => {
  const { Jsdc } = useContext(JSDCContext)
  const { dgw } = useContext(DguidewalksContext)
  // handler 只註冊一次，用 ref 才拿得到最新的 onResolve
  const onResolveRef = useRef(onResolve)
  onResolveRef.current = onResolve

  useEffect(() => {
    if (!enabled || !dgw) return
    const handler = async () => {
      const params = new URLSearchParams(window.location.search)
      const targetId = params.get(paramKey)
      if (!targetId) return

      const marker = dgw.findSceneById(targetId)
      if (!marker) {
        console.warn(`[useDeepLinkPoint] no scene with id="${targetId}"`)
        return
      }

      const map = await Jsdc.asyncViewer
      map.flyTo(marker.getLatLng(), flyToZoom, { duration: flyToDuration })
      map.once('moveend', () => {
        setTimeout(() => onResolveRef.current(marker), delayMs)
      })
    }

    // 景點圖層可能已經載完（事件早就發過），這時直接處理
    if (dgw.sceneLayer) {
      handler()
      return
    }
    return dgw.gisDataLoadEvent.addEventListener(handler)
  }, [])
}

export default useDeepLinkPoint
