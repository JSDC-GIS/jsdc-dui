import React from 'react';
import { DuiLanguage } from '../../i18n/config';
export interface IDguideWalksAppProps {
    mainMenuChildren?: React.ReactNode;
    endMenuChildren?: React.ReactNode;
    /**
     * 初次訪客的預設語言（如 'en'）。僅在使用者尚未手動切換過（localStorage 無偏好）時套用；
     * 使用者用語言切換器切換後，其選擇會被持久化並在往後造訪勝出。
     * 有語言切換器的雙語站台用這個。
     */
    defaultLanguage?: string;
    /**
     * 固定語言：無條件使用指定語言，不讀也不寫 localStorage。
     * 單語系、藏掉語言切換器（`settingConfig.disabled`）的站台用這個，
     * 否則會被同一個 host 底下其他專案留下的語言偏好鎖住。
     * 與 `defaultLanguage` 同時傳時以 `language` 為準。
     */
    language?: DuiLanguage;
}
declare const DguideWalksApp: React.FC<IDguideWalksAppProps>;
export default DguideWalksApp;
