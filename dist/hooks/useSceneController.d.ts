import { SceneFeature } from '../JSDC/Dguidewalks/ApiProvider';
import { SceneMarker } from '../JSDC/Dguidewalks/scene';
import type { ICheckInCardProps } from '../components/LeafletPopup/CheckInCard';
import { UseDeepLinkPointOptions } from './useDeepLinkPoint';
export type SceneCheckinSrcBuilder = (context: {
    eventId: string;
    feature: SceneFeature;
    /** 集章用的點名（`legacyName ?? title`）。 */
    name: string;
    /** `btoa(encodeURI('{eventId}:{name}'))`。 */
    key: string;
}) => string;
export type SceneDeepLinkConfig = Omit<UseDeepLinkPointOptions, 'onResolve' | 'enabled'>;
/**
 * 景點圖層的內建行為設定。全部選填，預設值就是下游原本各自複製的那套標準寫法：
 * 點 marker 開集章卡片、cluster、`?id=` 深連結、列表的定位與導航。
 */
export type SceneConfig = {
    /** 景點是否做 cluster。預設 true。 */
    cluster?: boolean;
    /** 集章的有效距離（公尺）。預設 100；不限距離傳 `Infinity`。網址帶 `#debug` 時一律不限。 */
    validDistance?: number;
    /** 景點列表定位鈕飛過去的縮放層級。預設 18.5。 */
    targetZoom?: number;
    /** 自訂集章 iframe 網址。預設 `https://map.jsdc.com.tw/tools/checkin/{eventId}/ci.php?s={key}`。 */
    checkinSrc?: SceneCheckinSrcBuilder;
    /** 集章 iframe 對話框上方的主視覺圖。 */
    checkinKanbanImgSrc?: string;
    /** 卡片是否顯示分享鈕（複製 `?id={documentId}` 連結）。預設 true。 */
    share?: boolean;
    /** `?id=` 深連結。預設開啟；傳 false 關閉，或傳物件調整參數。 */
    deepLink?: boolean | SceneDeepLinkConfig;
    /** 集章 iframe 用 postMessage 傳 `'lng,lat'` 回來時，是否開 Google 步行導航。預設 true。 */
    navigationMessage?: boolean;
    /**
     * 覆寫景點被點擊（或由深連結解析到）時的行為。
     * `openDefault()` 會開內建的集章卡片，可以在前後加自己的邏輯，或完全不呼叫。
     */
    onSceneClick?: (marker: SceneMarker, openDefault: () => void) => void;
};
export declare const DEFAULT_SCENE_TARGET_ZOOM = 18.5;
declare const useSceneController: (config?: SceneConfig) => {
    config: SceneConfig;
    /** 目前開著卡片的景點；沒開時為 undefined。 */
    marker: SceneMarker | undefined;
    cardProps: Partial<ICheckInCardProps>;
    shareUrl: string | undefined;
    /** 集章 iframe 的網址；按下集章後才有值。 */
    checkinSrc: string | undefined;
    openSceneCard: (target: SceneMarker) => void;
    closeSceneCard: () => void;
    closeCheckin: () => void;
    flyToScene: (feature: SceneFeature) => void;
    navigateToScene: (feature: SceneFeature) => void;
};
export type SceneController = ReturnType<typeof useSceneController>;
export default useSceneController;
