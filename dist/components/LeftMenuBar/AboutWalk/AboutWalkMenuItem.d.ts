/// <reference types="react" />
import { IMenuItemWithDialogProps } from '../MenuList/MenuItemWithDialog';
import { IAboutWalkDialogContentProps } from './AboutWalkDialogContent';
export interface IAboutWalkMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, IAboutWalkDialogContentProps {
}
declare const AboutWalkMenuItem: (props: IAboutWalkMenuItemProps) => JSX.Element;
export default AboutWalkMenuItem;
