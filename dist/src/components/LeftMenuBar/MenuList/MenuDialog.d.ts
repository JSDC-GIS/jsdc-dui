import React from 'react';
import './MenuDialog.scss';
export interface IMenuDialogProps {
    imgSrc?: string;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}
declare const MenuDialog: ({ imgSrc, title, children, onClose }: IMenuDialogProps) => JSX.Element;
export default MenuDialog;
