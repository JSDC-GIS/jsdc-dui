import React, { useContext } from 'react'
import icon from '../../../icon'
import './index.scss'
import { LatLng } from 'leaflet'
import useGeolocation from '../../../hooks/useGeolocation'
import { JSDCContext } from '../../../JSDC/Context'
import NavigatorArrow from '../../Icons/NavigatorArrow'
import { DuiContext } from '../../Context'
import { SceneFeature } from '../../../JSDC/Dguidewalks/ApiProvider'
import useGoogleNavigator from '../../../hooks/useGoogleNavigator'

export interface ICheckInCardProps extends React.HTMLProps<HTMLDivElement> {
  title: string
  subtitle: string
  imgSrc: string
  mainTextContent: string
  credit: string
  sceneLatLng: LatLng
  /**
   * 這張卡片所屬的景點。有給時導航鈕走 `DuiContext.onSceneNavigate(feature)`（下游可覆寫）；
   * 沒給（單獨使用這個元件）就直接從 `userLatLng` 步行導航到 `sceneLatLng`。
   */
  feature?: SceneFeature
  innerRef?: React.ForwardedRef<HTMLDivElement>
  onCheckin?: (src: string) => void
  userLatLng?: ReturnType<typeof useGeolocation>['latLng']
  checkinSrc?: string
  /**
   * 組集章 key 用的點名，與顯示用的 `title` 分開：少數舊點的集章 key 必須沿用
   * GIS 原名（`legacyName`）。沒給時用 `title`。有傳 `checkinSrc` 時不會用到。
   */
  checkinName?: string
  validDistance?: number
}
function toCurrency(num: number) {
  var parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const CheckInCard: React.FC<Partial<ICheckInCardProps>> = ({
  title = '...',
  subtitle = '...',
  imgSrc = icon.others.processing,
  mainTextContent = '...',
  credit = '　:　',
  innerRef,
  sceneLatLng,
  feature,
  userLatLng: latLng,
  checkinSrc,
  checkinName,
  validDistance = Infinity,
  onCheckin = () => null,
}) => {
  const { Jsdc } = useContext(JSDCContext)
  const dui = useContext(DuiContext)
  const { walkTo } = useGoogleNavigator()
  const distance =
    latLng && sceneLatLng ? sceneLatLng.distanceTo(latLng) : Infinity
  const readableDistance =
    distance === Infinity ? '----' : toCurrency(Math.floor(distance))

  const isCheckinValid = distance < validDistance

  const handleCheckin = () => {
    if (!isCheckinValid) return
    const checkinIframeSrc =
      checkinSrc ||
      `https://map.jsdc.com.tw/tools/checkin/${Jsdc.id}/ci.php?s=${window.btoa(encodeURI(`${Jsdc.id}:${checkinName ?? title}`))}`
    onCheckin(checkinIframeSrc)
  }

  // 卡片本來就知道自己是哪個景點，不再用 title 回頭查
  const handleNavigate = () => {
    if (feature && dui.onSceneNavigate) return dui.onSceneNavigate(feature)
    sceneLatLng && walkTo(latLng, sceneLatLng)
  }

  return (
    <div className="dui-CheckInPopup" ref={innerRef}>
      <div className="dui-CheckInPopup-Kanban">
        <img src={imgSrc} />
        <div className="dui-CheckInPopup-action">
          {latLng ? (
            isCheckinValid ? (
              <>
                <span>
                  距離景點<span id="distance">{readableDistance}</span>公尺
                </span>
                <span>請集章！</span>
              </>
            ) : (
              <>
                <span>
                  距離景點還有<span>{readableDistance}</span>公尺
                </span>
                <span>距離太遠囉!</span>
              </>
            )
          ) : (
            <span>尚未取得定位</span>
          )}

          <button
            className="action-btn"
            id="checkinBtn"
            disabled={!isCheckinValid}
            onClick={() => handleCheckin()}
          >
            數位集章
          </button>
        </div>
      </div>
      <p className="dui-CheckInPopup-geonavigator" onClick={handleNavigate}>
        <NavigatorArrow />
      </p>
      <div className="dui-CheckInPopup-artical">
        <div className="header">
          <p className="title">{title}</p>
          <p className="subtitle">{subtitle}</p>
        </div>
        <div className="content">{mainTextContent}</div>
        <div className="CheckInPopup-credit">
          <span>{credit}</span>
        </div>
      </div>
    </div>
  )
}
CheckInCard.displayName = 'CheckInCard'
export default CheckInCard
