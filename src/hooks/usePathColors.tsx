import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import { PathColorItem } from '../JSDC/Dguidewalks/mapLayers'

/**
 * 「路線顏色」選單的資料：由 `mapConfig` 已載入的線圖層產生，換語言時重算（不重新請求）。
 * 圖層載入前是空陣列。
 */
const usePathColors = () => {
  const { dgw } = useContext(DguidewalksContext)
  const { i18n } = useTranslation()
  const [items, setItems] = useState<PathColorItem[]>([])

  useEffect(() => {
    if (!dgw) return
    const update = () => setItems(dgw.getPathColors(i18n.language))
    // 圖層可能已經載完（事件早就發過）
    update()
    return dgw.dataLoadEvent.addEventListener(update)
  }, [dgw, i18n.language])

  return items
}

export default usePathColors
