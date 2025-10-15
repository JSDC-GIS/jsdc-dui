import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import LayerDialogContent, {
  ILayerDialogContentProps,
} from './LayerDialogContent'
import Layer from '../../Icons/Layer'
import { useTranslation } from 'react-i18next'

export interface ILayerMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    ILayerDialogContentProps {}

const LayerMenuItem: React.FC<ILayerMenuItemProps> = (
  props: ILayerMenuItemProps,
) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.mapLayer')} Icon={Layer}>
      <LayerDialogContent {...props} />
    </MenuItemWithDialog>
  )
}
LayerMenuItem.displayName = 'LayerMenuItem'
export default LayerMenuItem
