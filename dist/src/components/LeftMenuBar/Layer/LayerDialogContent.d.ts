import React from 'react';
import { ILayerItemProps } from './LayerItem';
import './LayerDialogContent.scss';
export interface ILayerDialogContentProps {
    layerInfos: Omit<ILayerItemProps, 'onToggleShow' | 'onOpacityChange'>[];
    onToggleShow: (id: string, show: boolean) => void;
    onOpacityChange: (id: string, value: number) => void;
}
declare const LayerDialogContent: React.FC<ILayerDialogContentProps>;
export default LayerDialogContent;
