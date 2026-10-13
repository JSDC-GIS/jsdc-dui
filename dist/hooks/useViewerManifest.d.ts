import { WalkViewerAssets } from '../JSDC/Dguidewalks/ApiProvider';
/**
 * 「加到主畫面」的圖示（web app manifest）：下游 `public/manifest.json` 是靜態檔（fallback），
 * `viewerAssets.logo` 有值時抓它回來、把 `icons` 換成 Strapi 的圖示，再把 `<link rel="manifest">`
 * 指向新的內容；沒有 logo、抓不到或格式不對就完全不動。只做一次，卸載時不還原。
 */
declare const useViewerManifest: (viewerAssets: WalkViewerAssets | null | undefined) => void;
export default useViewerManifest;
