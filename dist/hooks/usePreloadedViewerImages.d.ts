import { WalkViewerAssets } from '../JSDC/Dguidewalks/ApiProvider';
import { ViewerImageAssets } from '../JSDC/Dguidewalks/viewerAssets';
/**
 * 三張圖（桌機主視覺、手機版橫幅、路線介紹）換成 Strapi 的之前先在背景載完：
 * 回傳的物件只含「已經載入成功」的網址，還在載、載入失敗的欄位是 null，
 * 交給 `resolveViewerImages` 就會繼續顯示下游的圖（沒有下游的圖就先不顯示），不會閃空白或破圖。
 * 同一張圖只預載一次；元件卸載後載完的結果不會再更新 state。
 */
declare const usePreloadedViewerImages: (viewerAssets: WalkViewerAssets | null | undefined) => ViewerImageAssets;
export default usePreloadedViewerImages;
