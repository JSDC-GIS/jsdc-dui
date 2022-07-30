import React from 'react';
import './index.scss';
export interface IResponsiveDialogProps {
    Icon?: React.ReactNode;
    title?: string;
    open: boolean;
    children: React.ReactNode;
    kanbanImgSrc?: string;
    onClose: () => void;
    disabledFixedPosition?: boolean;
    keepAlive?: boolean;
}
declare const ResponsiveDialog: React.FC<IResponsiveDialogProps>;
export default ResponsiveDialog;
