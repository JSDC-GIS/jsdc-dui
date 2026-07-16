import React from 'react';
import { IMenuItemWithDialogProps } from '../MenuList/MenuItemWithDialog';
export interface ISettingMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'> {
}
declare const SettingMenuItem: React.FC<ISettingMenuItemProps>;
export default SettingMenuItem;
