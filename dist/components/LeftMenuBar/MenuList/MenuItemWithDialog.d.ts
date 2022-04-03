import React from 'react';
import './MenuItemWithDialog.scss';
export interface IMenuItemWithDialogProps {
    onClick?: () => void;
    onActiveChange?: (val?: boolean) => void;
    onClose?: () => void;
    startIconSrc?: string;
    startIconSrcActive?: string;
    title: string;
    children: React.ReactNode;
    active?: boolean;
}
declare const MenuItemWithDialog: ({ onClick, onActiveChange, onClose, startIconSrc, startIconSrcActive, title, children, active }: IMenuItemWithDialogProps) => JSX.Element;
export default MenuItemWithDialog;
