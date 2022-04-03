import React from 'react';
import './LayerItem.scss';
export interface ILayerItemProps {
    id: string;
    name: string;
    type: 'vector' | 'image' | string;
    show: boolean;
    onToggleShow: (show: boolean) => void;
    onOpacityChange: (value: number) => void;
}
declare const LayerItem: React.FC<ILayerItemProps>;
export default LayerItem;
