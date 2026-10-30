import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhTW from './locales/zh-TW.json';
import en from './locales/en.json';

export type DuiLanguage = 'zh-TW' | 'en';

/**
 * 所有走讀專案都部署在同一個 host 的不同路徑下（/webgis/dguidedwalks/{id}/），
 * localStorage 是跨專案共用的。把 key 依「目前頁面所在目錄」加後綴，讓每個專案的
 * 語言偏好各自獨立，不會互相覆蓋。
 */
export const scopedStorageKey = (base: string): string => {
  if (typeof window === 'undefined') return base;
  const dir = window.location.pathname.replace(/[^/]*$/, '');
  return `${base}@${dir}`;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': {
        translation: zhTW,
      },
      en: {
        translation: en,
      },
    },
    // 不寫死 lng：沒有已存偏好時，交給 fallbackLng（維持預設 zh-TW）
    fallbackLng: 'zh-TW',
    supportedLngs: ['zh-TW', 'en'],
    detection: {
      // 只看 localStorage 的已存偏好，不用 navigator/htmlTag，避免現有台灣使用者被意外切成 en；
      // 「預設語言」交由 DguideWalksApp 的 defaultLanguage prop 明確控制。
      order: ['localStorage'],
      caches: ['localStorage'], // 切換語言後寫回 → 真正持久化
      lookupLocalStorage: scopedStorageKey('i18nextLng'),
    },
    interpolation: {
      escapeValue: false,
    },
  });

/**
 * 固定語言模式（DguideWalksApp 的 `language` prop）：
 * 無條件切到指定語言，並停掉 language detector 的寫回，讓這個專案不讀也不寫 localStorage。
 * 單語系、藏掉語言切換器的站台用這個，才不會被其他專案留下的偏好鎖住。
 */
export const applyFixedLanguage = (lng: DuiLanguage): void => {
  const detector = i18n.services?.languageDetector as
    | { options?: { caches?: string[] } }
    | undefined;
  if (detector?.options) detector.options.caches = [];
  if (i18n.language !== lng) i18n.changeLanguage(lng);
};

export default i18n;
