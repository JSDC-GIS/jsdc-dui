export type StyleType = {
    [k: string]: string;
};
declare const useCssVariable: (style: StyleType) => StyleType;
export default useCssVariable;
/** 背景圖用的 CSS 值。沒有圖時回傳 `none`，不會變成 `url(undefined)` 去請求一個不存在的檔案。 */
export declare const cssUrl: (src?: string | null) => string;
