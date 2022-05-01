import React from 'react';
import { IActivableProps } from '../../Icons/types';
import './MenuDialog.scss';
export interface IMenuDialogProps {
    Icon: ({ active }: IActivableProps) => JSX.Element;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}
declare const MenuDialog: ({ Icon, title, children, onClose }: IMenuDialogProps) => JSX.Element;
export default MenuDialog;
