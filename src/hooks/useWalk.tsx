import { useContext, useEffect, useState } from 'react'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import { WalkResponse } from '../JSDC/Dguidewalks/ApiProvider'

export type WalkState = {
  /** `/walks/{eventId}` 的回應。載入前、或請求失敗時為 undefined。 */
  walk: WalkResponse | undefined
  /** 請求已經有結果（成功或失敗）。用來區分「還沒載入」和「載入了但沒有資料」。 */
  settled: boolean
}

/**
 * 在 React 層取得 `/walks/{eventId}` 的回應。走 `dgw.loadWalk()`，和圖層、景點共用同一次請求，
 * 不會多打；`/walks` 一回來就更新（不用等各個 GeoJSON 檔載完的 `dataLoadEvent`）。
 */
const useWalk = (): WalkState => {
  // DuiContextProvider 若被放在 DguidewalksProvider 外面，dgw 會是 undefined
  const { dgw } = useContext(DguidewalksContext)
  const [state, setState] = useState<WalkState>({
    walk: dgw?.walk,
    settled: !!dgw?.walk,
  })

  useEffect(() => {
    if (!dgw) return
    let cancelled = false
    dgw
      .loadWalk()
      .then((walk) => cancelled || setState({ walk, settled: true }))
      // 錯誤已在 dgw.loadWalk 記錄
      .catch(() => cancelled || setState({ walk: undefined, settled: true }))
    return () => {
      cancelled = true
    }
  }, [dgw])

  return state
}

export default useWalk
