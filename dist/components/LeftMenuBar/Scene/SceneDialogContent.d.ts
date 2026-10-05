import React from 'react';
import './SceneDialogContent.scss';
import { Article } from '../../../JSDC/Dguidewalks/proxyParser/@types';
import { SceneFeature } from '../../../JSDC/Dguidewalks/ApiProvider';
export interface ISceneDialogContentProps {
    onTarget: (feature: SceneFeature) => void;
    onNavigate: (feature: SceneFeature) => void;
    cardsReducer?: (data: Article[]) => Article[];
}
declare const SceneDialogContent: React.FC<ISceneDialogContentProps>;
export default SceneDialogContent;
