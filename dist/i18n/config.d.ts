import i18n from 'i18next';
export type DuiLanguage = 'zh-TW' | 'en';
/**
 * 所有走讀專案都部署在同一個 host 的不同路徑下（/webgis/dguidedwalks/{id}/），
 * localStorage 是跨專案共用的。把 key 依「目前頁面所在目錄」加後綴，讓每個專案的
 * 語言偏好各自獨立，不會互相覆蓋。
 */
export declare const scopedStorageKey: (base: string) => string;
/**
 * 固定語言模式（DguideWalksApp 的 `language` prop）：
 * 無條件切到指定語言，並停掉 language detector 的寫回，讓這個專案不讀也不寫 localStorage。
 * 單語系、藏掉語言切換器的站台用這個，才不會被其他專案留下的偏好鎖住。
 */
export declare const applyFixedLanguage: (lng: DuiLanguage) => void;
export default i18n;
