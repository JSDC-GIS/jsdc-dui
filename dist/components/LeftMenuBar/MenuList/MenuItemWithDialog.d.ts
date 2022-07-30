import React from 'react';
import { IActivableProps } from '../../Icons/types';
import './MenuItemWithDialog.scss';
export interface IMenuItemWithDialogProps {
    onClick?: () => void;
    onActiveChange?: (val?: boolean) => void;
    onClose?: () => void;
    Icon: ({ active }: IActivableProps) => JSX.Element;
    title: string;
    children: React.ReactNode;
    active?: boolean;
}
declare const MenuItemWithDialog: React.FC<IMenuItemWithDialogProps>;
export default MenuItemWithDialog;
