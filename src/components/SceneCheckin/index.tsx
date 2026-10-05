import React, { useContext, useEffect } from 'react'
import { DuiContext } from '../Context'
import { JSDCContext } from '../../JSDC/Context'
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import useCluster from '../../JSDC/hooks/layerVisualization/useCluster'
import ResponsiveDialog from '../ResponsiveDialog'
import CheckInCard from '../LeafletPopup/CheckInCard'
import './index.scss'

// 獨立成元件是因為 useCluster 一掛上就會把 cluster group 加到地圖，
// 不做 cluster 的專案（sceneConfig.cluster = false）不能呼叫它。
const SceneCluster: React.FC = () => {
  const { Jsdc } = useContext(JSDCContext)
  const { dgw } = useContext(DguidewalksContext)
  const { addLayer } = useCluster(Jsdc.asyncViewer)

  useEffect(() => {
    const add = () => dgw.sceneLayer && addLayer(dgw.sceneLayer)
    // 景點圖層可能已經載完（事件早就發過）
    if (dgw.sceneLayer) {
      add()
      return
    }
    return dgw.gisDataLoadEvent.addEventListener(add)
  }, [])
  return null
}

/**
 * 景點的內建畫面：集章卡片、集章 iframe 對話框，以及景點 cluster。
 * 由 DguideWalksApp 渲染，狀態在 DuiContext（`dui.scene`），下游不需要自己放。
 */
const SceneCheckin: React.FC = () => {
  const { scene } = useContext(DuiContext)
  const { geolocation } = useContext(DguidewalksContext)

  return (
    <>
      {scene.config.cluster !== false && <SceneCluster />}
      <ResponsiveDialog
        kanbanImgSrc={scene.config.checkinKanbanImgSrc}
        open={!!scene.checkinSrc}
        onClose={scene.closeCheckin}
      >
        {/* 沒有 dui- 前綴的 class 是下游既有樣式在用的名稱，保留才不會跑版 */}
        <div className="dui-CheckInIframeContainer CheckInIframeContainer">
          {!!scene.checkinSrc && (
            <iframe title="數位集章" src={scene.checkinSrc}></iframe>
          )}
        </div>
      </ResponsiveDialog>
      <ResponsiveDialog
        open={!!scene.marker}
        onClose={scene.closeSceneCard}
        shareUrl={scene.shareUrl}
      >
        <CheckInCard userLatLng={geolocation.latLng} {...scene.cardProps} />
      </ResponsiveDialog>
    </>
  )
}
SceneCheckin.displayName = 'SceneCheckin'
export default SceneCheckin
