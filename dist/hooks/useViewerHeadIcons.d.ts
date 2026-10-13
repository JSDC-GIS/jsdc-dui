import { WalkViewerAssets } from '../JSDC/Dguidewalks/ApiProvider';
/**
 * 分頁圖示與 iOS 主畫面圖示：下游 `index.html` 的 `<link>` 指向專案內的檔案（fallback），
 * `viewerAssets` 有值時把它們換成 Strapi 的網址；沒有值就完全不動。卸載時不還原。
 */
declare const useViewerHeadIcons: (viewerAssets: WalkViewerAssets | null | undefined) => void;
export default useViewerHeadIcons;
