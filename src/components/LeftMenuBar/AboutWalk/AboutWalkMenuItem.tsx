import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../MenuList/MenuItemWithDialog'
import React from 'react'
import AboutWalkDialogContent, {
  IAboutWalkDialogContentProps,
} from './AboutWalkDialogContent'
import About from '../../Icons/About'

export interface IAboutWalkMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    IAboutWalkDialogContentProps {}

const AboutWalkMenuItem: React.FC<IAboutWalkMenuItemProps> = (
  props: IAboutWalkMenuItemProps,
) => {
  return (
    <MenuItemWithDialog {...props} title="路線介紹" Icon={About}>
      <AboutWalkDialogContent {...props} />
    </MenuItemWithDialog>
  )
}
AboutWalkMenuItem.displayName = 'AboutWalkMenuItem'
export default AboutWalkMenuItem
