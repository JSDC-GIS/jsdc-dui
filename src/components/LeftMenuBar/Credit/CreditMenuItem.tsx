import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import CreditDialogContent, {
  ICreditDialogContentProps,
} from './CreditDialogContent'
import Info from '../../Icons/Info'

export interface ICreditMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    ICreditDialogContentProps {}

const CreditMenuItem: React.FC<ICreditMenuItemProps> = ({
  herf,
  description,
  ...props
}: ICreditMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title="關於圖臺" Icon={Info}>
      <CreditDialogContent description={description} herf={herf} />
    </MenuItemWithDialog>
  )
}
CreditMenuItem.displayName = 'CreditMenuItem'
export default CreditMenuItem
