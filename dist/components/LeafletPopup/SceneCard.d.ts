import React from 'react';
import './index.scss';
export interface ISceneCardProps {
    title: string;
    subtitle: string;
    imgSrc: string;
    mainTextContent: string;
    /**
     * 已過濾的內文 HTML（`toSceneContentHtml` 的結果）。有值就取代 `mainTextContent`；
     * 不要傳未過濾的字串進來。
     */
    mainHtmlContent: string;
    credit: string;
}
declare const SceneCard: React.FC<Partial<ISceneCardProps>>;
export default SceneCard;
