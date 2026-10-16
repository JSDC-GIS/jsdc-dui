/**
 * 純文字（`summary`、約 330 個景點的 `body`）轉成 HTML：
 * 空行分段成 `<p>`，段內的單一換行變 `<br>`。
 */
export declare function plainTextToHtml(text: string): string;
/**
 * 景點內文（Strapi `body`／`bodyEn`／`summary`）轉成可以直接放進 DOM 的 HTML。
 *
 * - 沒有 HTML 標籤就當純文字處理（`plainTextToHtml`）。
 * - 有標籤就用 DOMPurify 過濾：`style`、`class` 保留；連結開新分頁；
 *   iframe 只留 Google 地圖並補 `title`。相對網址不改寫（v10 請後端改成完整網址）。
 */
export declare function toSceneContentHtml(raw: string | null | undefined): string;
