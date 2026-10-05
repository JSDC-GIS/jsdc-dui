import { SceneMarker } from '../JSDC/Dguidewalks/scene';
export interface UseDeepLinkPointOptions {
    onResolve: (marker: SceneMarker) => void;
    paramKey?: string;
    flyToZoom?: number;
    flyToDuration?: number;
    delayMs?: number;
    /** false 時完全不處理深連結。hook 不能條件式呼叫，所以用參數關。 */
    enabled?: boolean;
}
/**
 * 網址帶 `?id=` 時飛到該景點並回呼 `onResolve`。
 * id 用 `dgw.findSceneById` 解析，同時接受 Strapi documentId 與舊的 GIS UUID（`legacyGisId`），
 * 已經分享出去的舊連結才不會失效。
 */
declare const useDeepLinkPoint: ({ onResolve, paramKey, flyToZoom, flyToDuration, delayMs, enabled, }: UseDeepLinkPointOptions) => void;
export default useDeepLinkPoint;
