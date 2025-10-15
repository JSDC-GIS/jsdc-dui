import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import CreditDialogContent, {
  ICreditDialogContentProps,
} from './CreditDialogContent'
import Info from '../../Icons/Info'
import { useTranslation } from 'react-i18next'

export interface ICreditMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    ICreditDialogContentProps {}

const CreditMenuItem: React.FC<ICreditMenuItemProps> = ({
  herf,
  description,
  ...props
}: ICreditMenuItemProps) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.aboutPlatform')} Icon={Info}>
      <CreditDialogContent description={description} herf={herf} />
    </MenuItemWithDialog>
  )
}
CreditMenuItem.displayName = 'CreditMenuItem'
export default CreditMenuItem
