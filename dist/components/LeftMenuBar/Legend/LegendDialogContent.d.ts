import icon from '../../../icon';
import React from 'react';
import './LegendDialogContent.scss';
export interface ILegendDialogContentProps {
    activeLegends: Array<keyof typeof icon.legend>;
}
declare const LegendDialogContent: React.FC<ILegendDialogContentProps>;
export default LegendDialogContent;
