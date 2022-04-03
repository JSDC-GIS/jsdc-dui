import React from 'react';
import './index.scss';
export interface IDialogProps {
    onClose: () => void;
    title?: string;
    open: boolean;
}
declare const Dialog: React.FC<IDialogProps>;
export default Dialog;
