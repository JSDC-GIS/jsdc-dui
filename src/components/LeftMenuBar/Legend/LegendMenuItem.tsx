import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import LegendDialogContent, {
  ILegendDialogContentProps,
} from './LegendDialogContent'
import Hamburger from '../../Icons/Hamburger'
import { useTranslation } from 'react-i18next'

export interface ILegendMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    ILegendDialogContentProps {}

const LegendMenuItem: React.FC<ILegendMenuItemProps> = (
  props: ILegendMenuItemProps,
) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.legendDescription')} Icon={Hamburger}>
      <LegendDialogContent activeLegends={props.activeLegends} />
    </MenuItemWithDialog>
  )
}
LegendMenuItem.displayName = 'LegendMenuItem'
export default LegendMenuItem
