import MenuItemWithDialog, { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import LayerDialogContent, { ILayerDialogContentProps } from './LayerDialogContent'

export interface ILayerMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'startIconSrc' | 'startIconSrcActive' | 'children'>, ILayerDialogContentProps {

}

const LayerMenuItem = (props: ILayerMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title='地圖圖層' startIconSrc={icon.activable.layer} startIconSrcActive={icon.activable.layerActive}>
      <LayerDialogContent {...props}/>
    </MenuItemWithDialog>
  )
}

export default LayerMenuItem
