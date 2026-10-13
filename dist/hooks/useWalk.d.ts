import { WalkResponse } from '../JSDC/Dguidewalks/ApiProvider';
export type WalkState = {
    /** `/walks/{eventId}` 的回應。載入前、或請求失敗時為 undefined。 */
    walk: WalkResponse | undefined;
    /** 請求已經有結果（成功或失敗）。用來區分「還沒載入」和「載入了但沒有資料」。 */
    settled: boolean;
};
/**
 * 在 React 層取得 `/walks/{eventId}` 的回應。走 `dgw.loadWalk()`，和圖層、景點共用同一次請求，
 * 不會多打；`/walks` 一回來就更新（不用等各個 GeoJSON 檔載完的 `dataLoadEvent`）。
 */
declare const useWalk: () => WalkState;
export default useWalk;
