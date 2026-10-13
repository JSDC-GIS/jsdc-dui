export type PreloadStatus = 'loading' | 'loaded' | 'failed';
/** 這張圖的預載狀態；還沒預載過是 undefined。 */
export declare const getPreloadStatus: (src: string) => PreloadStatus | undefined;
/**
 * 在背景把圖載完。回傳的 promise 不會 reject：載入成功是 true，
 * 失敗（404、網路錯誤）是 false 並 `console.warn` 一次。
 * 同一個網址重複呼叫會拿到同一個 promise，不會重複下載，失敗的也不會重試。
 */
export declare const preloadImage: (src: string) => Promise<boolean>;
/** 測試用：清掉預載紀錄。 */
export declare const resetPreloadedImages: () => void;
