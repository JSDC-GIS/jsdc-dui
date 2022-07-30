import React from 'react';
import './index.scss';
export interface ISceneCardProps {
    title: string;
    subtitle: string;
    imgSrc: string;
    mainTextContent: string;
    credit: string;
}
declare const SceneCard: React.FC<Partial<ISceneCardProps>>;
export default SceneCard;
