import { LegendName } from '../../icon';
import { SceneCategory, WalkViewerAssets } from './ApiProvider';
/** 下游傳給 `DuiContextProvider` 的三張圖，角色是 Strapi 沒有圖時的 fallback。 */
export type ViewerImageFallbacks = {
    headerDImgSrc?: string;
    headerMBImgSrc?: string;
    aboutWalkImgSrc?: string;
};
/** 實際要顯示的三張圖。沒有圖時是空字串（呼叫端據此不渲染，不會出現破圖）。 */
export type ViewerImages = {
    headerDImgSrc: string;
    headerMBImgSrc: string;
    aboutWalkImgSrc: string;
};
/** `<head>` 裡要換上的圖示網址；undefined 表示不動。 */
export type ViewerHeadIcons = {
    icon?: string;
    appleTouchIcon?: string;
};
/**
 * 三張圖各自的來源：`viewerAssets` 對應欄位有值就用它，否則用下游傳的 prop。
 * `headerDesktop` ↔ `headerDImgSrc`、`headerMobile` ↔ `headerMBImgSrc`、`about` ↔ `aboutWalkImgSrc`。
 * `/walks` 回來之前 `viewerAssets` 是 undefined，結果就是 prop。
 */
export declare const resolveViewerImages: (viewerAssets: WalkViewerAssets | null | undefined, fallbacks?: ViewerImageFallbacks) => ViewerImages;
/**
 * `<head>` 圖示的來源：`rel="icon"` 用 `logo`，沒有才用 `favicon`；
 * `rel="apple-touch-icon"` 用 `appleTouchIcon`，沒有才用 `logo`。都沒有就是 undefined（不動）。
 */
export declare const resolveViewerHeadIcons: (viewerAssets: WalkViewerAssets | null | undefined) => ViewerHeadIcons;
/**
 * 把 `<head>` 裡的 `<link rel="icon">`（含 `shortcut icon`）與 `<link rel="apple-touch-icon">`
 * 換成指定的網址；頁面上沒有對應的 `<link>` 時補一個。值是 undefined 的那一種完全不動。
 * 只處理這兩種 `<link>`，`manifest.json` 是靜態檔，不處理。
 */
export declare const applyViewerHeadIcons: (icons: ViewerHeadIcons, doc?: Document) => void;
/**
 * 圖例說明要亮起來的類別：`/walks` 的 `categories[].name`（中文類別名稱，不受語系影響）。
 * 只取名稱，不使用 `iconUrl`、`color`、`icon`；圖例沒有的類別名稱忽略。
 */
export declare const getLegendNamesFromCategories: (categories: Array<Pick<SceneCategory, 'name'> | null> | null | undefined) => LegendName[];
