import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import React from 'react';
import { ILayerDialogContentProps } from './LayerDialogContent';
export interface ILayerMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ILayerDialogContentProps {
}
declare const LayerMenuItem: React.FC<ILayerMenuItemProps>;
export default LayerMenuItem;
