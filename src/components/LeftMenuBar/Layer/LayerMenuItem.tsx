import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import LayerDialogContent, {
  ILayerDialogContentProps,
} from './LayerDialogContent'
import Layer from '../../Icons/Layer'

export interface ILayerMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    ILayerDialogContentProps {}

const LayerMenuItem: React.FC<ILayerMenuItemProps> = (
  props: ILayerMenuItemProps,
) => {
  return (
    <MenuItemWithDialog {...props} title="地圖圖層" Icon={Layer}>
      <LayerDialogContent {...props} />
    </MenuItemWithDialog>
  )
}
LayerMenuItem.displayName = 'LayerMenuItem'
export default LayerMenuItem
