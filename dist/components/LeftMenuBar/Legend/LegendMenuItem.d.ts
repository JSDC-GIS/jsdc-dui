/// <reference types="react" />
import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import { ILegendDialogContentProps } from './LegendDialogContent';
export interface ILegendMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'startIconSrc' | 'startIconSrcActive' | 'children'>, ILegendDialogContentProps {
}
declare const LegendMenuItem: (props: ILegendMenuItemProps) => JSX.Element;
export default LegendMenuItem;
