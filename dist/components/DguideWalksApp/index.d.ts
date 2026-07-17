import React from 'react';
export interface IDguideWalksAppProps {
    mainMenuChildren?: React.ReactNode;
    endMenuChildren?: React.ReactNode;
    /**
     * 初次訪客的預設語言（如 'en'）。僅在使用者尚未手動切換過（localStorage 無偏好）時套用；
     * 使用者用語言切換器切換後，其選擇會被持久化並在往後造訪勝出。
     */
    defaultLanguage?: string;
}
declare const DguideWalksApp: React.FC<IDguideWalksAppProps>;
export default DguideWalksApp;
