/// <reference types="react" />
import icon from '../../../icon';
import './LegendDialogContent.scss';
export interface ILegendDialogContentProps {
    activeLegends: Array<keyof typeof icon.legend>;
}
declare const LegendDialogContent: ({ activeLegends }: ILegendDialogContentProps) => JSX.Element;
export default LegendDialogContent;
