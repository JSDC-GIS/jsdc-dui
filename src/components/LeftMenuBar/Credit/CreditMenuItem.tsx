import MenuItemWithDialog, { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import CreditDialogContent, { ICreditDialogContentProps } from './CreditDialogContent'

export interface ICreditMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'startIconSrc' | 'startIconSrcActive' | 'children'>, ICreditDialogContentProps {

}

const CreditMenuItem = (props: ICreditMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title='關於圖台' startIconSrc={icon.activable.info} startIconSrcActive={icon.activable.infoActive}>
      <CreditDialogContent description={props.description} />
    </MenuItemWithDialog>
  )
}

export default CreditMenuItem
