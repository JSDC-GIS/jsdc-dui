import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../MenuList/MenuItemWithDialog'
import Setting from '../../Icons/Setting'
import LanguageSwitcher from '../../LanguageSwitcher'

export interface ISettingMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'> {
  /** 隱藏 dialog 內的語言切換器（選單項目本身仍保留） */
  languageSwitcherDisabled?: boolean
}

const SettingMenuItem: React.FC<ISettingMenuItemProps> = ({
  languageSwitcherDisabled,
  ...props
}: ISettingMenuItemProps) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.toolSettings')} Icon={Setting}>
      {languageSwitcherDisabled || <LanguageSwitcher />}
    </MenuItemWithDialog>
  )
}
SettingMenuItem.displayName = 'SettingMenuItem'
export default SettingMenuItem
