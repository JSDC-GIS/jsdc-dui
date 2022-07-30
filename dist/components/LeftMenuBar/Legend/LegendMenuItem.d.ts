import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import React from 'react';
import { ILegendDialogContentProps } from './LegendDialogContent';
export interface ILegendMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ILegendDialogContentProps {
}
declare const LegendMenuItem: React.FC<ILegendMenuItemProps>;
export default LegendMenuItem;
