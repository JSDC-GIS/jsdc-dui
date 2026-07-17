import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhTW from './locales/zh-TW.json';
import en from './locales/en.json';

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
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
