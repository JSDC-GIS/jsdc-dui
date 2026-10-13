import React from 'react';
import { PathColorItem } from '../../../JSDC/Dguidewalks/mapLayers';
import './PathColorDialogContent.scss';
export interface IPathColorDialogContentProps {
    items: PathColorItem[];
}
declare const PathColorDialogContent: React.FC<IPathColorDialogContentProps>;
export default PathColorDialogContent;
