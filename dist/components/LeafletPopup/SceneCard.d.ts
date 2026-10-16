import React from 'react';
import './index.scss';
/**
 * @deprecated 沒有集章功能的舊版景點卡片，jsdc-dui 內部與下游都沒有使用（2026-10-16 查過）。
 * 景點卡片請用 `CheckInCard`（`useSceneController` 已內建）。之後的大版本會移除。
 */
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
/**
 * @deprecated 沒有集章功能的舊版景點卡片，jsdc-dui 內部與下游都沒有使用（2026-10-16 查過）。
 * 景點卡片請用 `CheckInCard`（`useSceneController` 已內建）。之後的大版本會移除。
 */
declare const SceneCard: React.FC<Partial<ISceneCardProps>>;
export default SceneCard;
