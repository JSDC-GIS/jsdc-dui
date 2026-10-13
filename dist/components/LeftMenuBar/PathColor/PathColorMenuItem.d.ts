import React from 'react';
import { IMenuItemWithDialogProps } from '../MenuList/MenuItemWithDialog';
import { IPathColorDialogContentProps } from './PathColorDialogContent';
export interface IPathColorMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, IPathColorDialogContentProps {
}
declare const PathColorMenuItem: React.FC<IPathColorMenuItemProps>;
export default PathColorMenuItem;
