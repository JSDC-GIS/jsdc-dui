/// <reference types="react" />
import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import { ILayerDialogContentProps } from './LayerDialogContent';
export interface ILayerMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ILayerDialogContentProps {
}
declare const LayerMenuItem: (props: ILayerMenuItemProps) => JSX.Element;
export default LayerMenuItem;
