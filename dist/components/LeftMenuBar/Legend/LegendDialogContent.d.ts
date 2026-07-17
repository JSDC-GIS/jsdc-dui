import { LegendName } from '../../../icon';
import React from 'react';
import './LegendDialogContent.scss';
export interface ILegendDialogContentProps {
    activeLegends: Array<LegendName>;
}
declare const LegendDialogContent: React.FC<ILegendDialogContentProps>;
export default LegendDialogContent;
