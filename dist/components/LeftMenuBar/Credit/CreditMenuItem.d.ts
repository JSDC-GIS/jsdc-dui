import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import React from 'react';
import { ICreditDialogContentProps } from './CreditDialogContent';
export interface ICreditMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ICreditDialogContentProps {
}
declare const CreditMenuItem: React.FC<ICreditMenuItemProps>;
export default CreditMenuItem;
