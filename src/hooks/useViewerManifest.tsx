import { useEffect } from 'react'
import { WalkViewerAssets } from '../JSDC/Dguidewalks/ApiProvider'
import {
  applyViewerManifest,
  resolveViewerManifestIcons,
} from '../JSDC/Dguidewalks/viewerAssets'

/**
 * 「加到主畫面」的圖示（web app manifest）：下游 `public/manifest.json` 是靜態檔（fallback），
 * `viewerAssets.logo` 有值時抓它回來、把 `icons` 換成 Strapi 的圖示，再把 `<link rel="manifest">`
 * 指向新的內容；沒有 logo、抓不到或格式不對就完全不動。只做一次，卸載時不還原。
 */
const useViewerManifest = (
  viewerAssets: WalkViewerAssets | null | undefined,
) => {
  const hasIcons = resolveViewerManifestIcons(viewerAssets).length > 0
  const logo = viewerAssets?.logo
  const appleTouchIcon = viewerAssets?.appleTouchIcon
  useEffect(() => {
    if (!hasIcons) return
    applyViewerManifest({ logo, appleTouchIcon })
  }, [hasIcons, logo, appleTouchIcon])
}

export default useViewerManifest
