import { PathColorItem } from '../JSDC/Dguidewalks/mapLayers';
/**
 * 「路線顏色」選單的資料：由 `mapConfig` 已載入的線圖層產生，換語言時重算（不重新請求）。
 * 圖層載入前是空陣列。
 */
declare const usePathColors: () => PathColorItem[];
export default usePathColors;
