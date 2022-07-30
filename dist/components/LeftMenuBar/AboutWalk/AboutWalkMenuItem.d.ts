import { IMenuItemWithDialogProps } from '../MenuList/MenuItemWithDialog';
import React from 'react';
import { IAboutWalkDialogContentProps } from './AboutWalkDialogContent';
export interface IAboutWalkMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, IAboutWalkDialogContentProps {
}
declare const AboutWalkMenuItem: React.FC<IAboutWalkMenuItemProps>;
export default AboutWalkMenuItem;
