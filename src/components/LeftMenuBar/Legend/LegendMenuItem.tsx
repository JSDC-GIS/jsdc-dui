import MenuItemWithDialog, { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import LegendDialogContent, { ILegendDialogContentProps } from './LegendDialogContent'

export interface ILegendMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'startIconSrc' | 'startIconSrcActive' | 'children'>, ILegendDialogContentProps {

}

const LegendMenuItem = (props: ILegendMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title='圖例說明' startIconSrc={icon.activable.hamburger} startIconSrcActive={icon.activable.hamburgerActive}>
      <LegendDialogContent activeLegends={props.activeLegends}/>
    </MenuItemWithDialog>
  )
}

export default LegendMenuItem
