/// <reference types="react" />
import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import { ICreditDialogContentProps } from './CreditDialogContent';
export interface ICreditMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'startIconSrc' | 'startIconSrcActive' | 'children'>, ICreditDialogContentProps {
}
declare const CreditMenuItem: (props: ICreditMenuItemProps) => JSX.Element;
export default CreditMenuItem;
