import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../MenuList/MenuItemWithDialog'
import Setting from '../../Icons/Setting'
import LanguageSwitcher from '../../LanguageSwitcher'

export interface ISettingMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'> {}

const SettingMenuItem: React.FC<ISettingMenuItemProps> = (
  props: ISettingMenuItemProps
) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.toolSettings')} Icon={Setting}>
      <LanguageSwitcher />
    </MenuItemWithDialog>
  )
}
SettingMenuItem.displayName = 'SettingMenuItem'
export default SettingMenuItem
