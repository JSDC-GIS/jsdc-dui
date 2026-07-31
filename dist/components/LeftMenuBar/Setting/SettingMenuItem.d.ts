import React from 'react';
import { IMenuItemWithDialogProps } from '../MenuList/MenuItemWithDialog';
export interface ISettingMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'> {
    /** 隱藏 dialog 內的語言切換器（選單項目本身仍保留） */
    languageSwitcherDisabled?: boolean;
}
declare const SettingMenuItem: React.FC<ISettingMenuItemProps>;
export default SettingMenuItem;
