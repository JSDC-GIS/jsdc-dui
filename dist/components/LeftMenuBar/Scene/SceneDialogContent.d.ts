import React from 'react';
import './SceneDialogContent.scss';
import { Article } from '../../../JSDC/Dguidewalks/proxyParser/@types';
export interface ISceneDialogContentProps {
    onTarget: (title: string) => void;
    onNavigate: (title: string) => void;
    cardsReducer?: (data: Article[]) => Article[];
}
declare const SceneDialogContent: React.FC<ISceneDialogContentProps>;
export default SceneDialogContent;
