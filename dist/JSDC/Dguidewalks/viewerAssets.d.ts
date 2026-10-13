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
/** `viewerAssets` 裡會顯示在畫面上的三張圖；沒有值的欄位是 null。 */
export type ViewerImageAssets = Pick<WalkViewerAssets, 'headerDesktop' | 'headerMobile' | 'about'>;
/** web app manifest 的一筆 `icons`。 */
export type ViewerManifestIcon = {
    src: string;
    sizes: string;
    type: string;
};
/** 取出三張圖的網址，沒有值（不存在、null、空字串）的一律整理成 null。預載用。 */
export declare const pickViewerImageAssets: (viewerAssets: Partial<WalkViewerAssets> | null | undefined) => ViewerImageAssets;
/**
 * 三張圖各自的來源：`viewerAssets` 對應欄位有值就用它，否則用下游傳的 prop。
 * `headerDesktop` ↔ `headerDImgSrc`、`headerMobile` ↔ `headerMBImgSrc`、`about` ↔ `aboutWalkImgSrc`。
 * `/walks` 回來之前 `viewerAssets` 是 undefined，結果就是 prop。
 */
export declare const resolveViewerImages: (viewerAssets: Partial<WalkViewerAssets> | null | undefined, fallbacks?: ViewerImageFallbacks) => ViewerImages;
/**
 * `<head>` 圖示的來源：`rel="icon"` 用 `logo`，沒有才用 `favicon`；
 * `rel="apple-touch-icon"` 用 `appleTouchIcon`，沒有才用 `logo`。都沒有就是 undefined（不動）。
 */
export declare const resolveViewerHeadIcons: (viewerAssets: WalkViewerAssets | null | undefined) => ViewerHeadIcons;
/**
 * 把 `<head>` 裡的 `<link rel="icon">`（含 `shortcut icon`）與 `<link rel="apple-touch-icon">`
 * 換成指定的網址；頁面上沒有對應的 `<link>` 時補一個。值是 undefined 的那一種完全不動。
 * 只處理這兩種 `<link>`；`<link rel="manifest">` 見 `applyViewerManifest`。
 */
export declare const applyViewerHeadIcons: (icons: ViewerHeadIcons, doc?: Document) => void;
/**
 * manifest 的圖示：`logo`（192×192 PNG）一定要有，`appleTouchIcon`（180×180 PNG）有值才放；
 * `favicon` 是 ICO，不放。沒有 `logo` 時是空陣列（不動下游的 manifest）。
 */
export declare const resolveViewerManifestIcons: (viewerAssets: Partial<WalkViewerAssets> | null | undefined) => ViewerManifestIcon[];
/**
 * 以下游現有的 manifest 為底，把 `icons` 換成 Strapi 的圖示，其餘欄位原樣保留。
 * 新的 manifest 會用 Blob URL 提供，相對網址會失去基準，所以 `start_url`、`scope`
 * 以及保留下來的相對 `src` / `url`（`screenshots`、`shortcuts`）先以原本 manifest 的網址
 * （`manifestUrl`，絕對網址）解析成絕對網址。沒有 `logo`、或 `manifest` 不是物件時回傳 undefined。
 */
export declare const buildViewerManifest: (manifest: unknown, manifestUrl: string, viewerAssets: Partial<WalkViewerAssets> | null | undefined) => Record<string, any> | undefined;
/** 已經換過的 `<link rel="manifest">` 會帶這個屬性，值是原本的 manifest 網址。 */
export declare const VIEWER_MANIFEST_ATTRIBUTE = "data-dui-viewer-manifest";
/**
 * 讓「加到主畫面」的圖示跟著 Strapi：抓 `<link rel="manifest">` 指到的下游 manifest，
 * 用 `buildViewerManifest` 換掉 `icons`，再把 `<link>` 指向新內容的 Blob URL。
 * 頁面沒有 `<link rel="manifest">`、抓不到、不是合法的 JSON 物件時只 `console.warn`，
 * 沒有 `logo` 時連警告都沒有——這些情況都完全不動原本的 `<link>`。
 * 每個 `<link>` 只換一次（換過的再呼叫不會重抓）。回傳是否有換。
 */
export declare const applyViewerManifest: (viewerAssets: Partial<WalkViewerAssets> | null | undefined, doc?: Document) => Promise<boolean>;
/**
 * 圖例說明要亮起來的類別：`/walks` 的 `categories[].name`（中文類別名稱，不受語系影響）。
 * 只取名稱，不使用 `iconUrl`、`color`、`icon`；圖例沒有的類別名稱忽略。
 */
export declare const getLegendNamesFromCategories: (categories: Array<Pick<SceneCategory, 'name'> | null> | null | undefined) => LegendName[];
