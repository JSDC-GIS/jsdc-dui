import { useEffect, useMemo, useState } from 'react'
import { WalkViewerAssets } from '../JSDC/Dguidewalks/ApiProvider'
import {
  ViewerImageAssets,
  pickViewerImageAssets,
} from '../JSDC/Dguidewalks/viewerAssets'
import { getPreloadStatus, preloadImage } from '../utils/preloadImage'

/**
 * 三張圖（桌機主視覺、手機版橫幅、路線介紹）換成 Strapi 的之前先在背景載完：
 * 回傳的物件只含「已經載入成功」的網址，還在載、載入失敗的欄位是 null，
 * 交給 `resolveViewerImages` 就會繼續顯示下游的圖（沒有下游的圖就先不顯示），不會閃空白或破圖。
 * 同一張圖只預載一次；元件卸載後載完的結果不會再更新 state。
 */
const usePreloadedViewerImages = (
  viewerAssets: WalkViewerAssets | null | undefined,
): ViewerImageAssets => {
  const { headerDesktop, headerMobile, about } =
    pickViewerImageAssets(viewerAssets)
  // 預載狀態存在模組層（見 preloadImage），這裡只需要在狀態改變時重新渲染
  const [, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;[headerDesktop, headerMobile, about].forEach((src) => {
      // 沒有值的不預載；已經有結果的不用再等
      if (!src || getPreloadStatus(src) === 'loaded') return
      if (getPreloadStatus(src) === 'failed') return
      preloadImage(src).then(
        (loaded) =>
          loaded && !cancelled && setVersion((version) => version + 1),
      )
    })
    return () => {
      cancelled = true
    }
  }, [headerDesktop, headerMobile, about])

  const loaded = (src: string | null) =>
    src && getPreloadStatus(src) === 'loaded' ? src : null
  const loadedDesktop = loaded(headerDesktop)
  const loadedMobile = loaded(headerMobile)
  const loadedAbout = loaded(about)
  return useMemo(
    () => ({
      headerDesktop: loadedDesktop,
      headerMobile: loadedMobile,
      about: loadedAbout,
    }),
    [loadedDesktop, loadedMobile, loadedAbout],
  )
}

export default usePreloadedViewerImages
