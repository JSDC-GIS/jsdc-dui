import MenuItemWithDialog, { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import CreditDialogContent, { ICreditDialogContentProps } from './CreditDialogContent'
import Info from '../../Icons/Info'

export interface ICreditMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ICreditDialogContentProps {

}

const CreditMenuItem = (props: ICreditMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title='關於圖台' Icon={Info}>
      <CreditDialogContent description={props.description} />
    </MenuItemWithDialog>
  )
}

export default CreditMenuItem
