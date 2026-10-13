import React from 'react';
import { ILayerItemProps } from './LayerItem';
import './LayerDialogContent.scss';
export interface ILayerDialogContentProps {
    layerInfos: (Omit<ILayerItemProps, 'onToggleShow' | 'onOpacityChange'> & {
        /** 圖磚的英文名稱（`mapConfig` 的 `nameEn`），語系是 en 時顯示。 */
        nameEn?: string;
    })[];
    onToggleShow: (id: string, show: boolean) => void;
    onOpacityChange: (id: string, value: number) => void;
}
declare const LayerDialogContent: React.FC<ILayerDialogContentProps>;
export default LayerDialogContent;
