import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../MenuList/MenuItemWithDialog'
import React from 'react'
import AboutWalkDialogContent, {
  IAboutWalkDialogContentProps,
} from './AboutWalkDialogContent'
import About from '../../Icons/About'
import { useTranslation } from 'react-i18next'

export interface IAboutWalkMenuItemProps
  extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    IAboutWalkDialogContentProps {}

const AboutWalkMenuItem: React.FC<IAboutWalkMenuItemProps> = (
  props: IAboutWalkMenuItemProps,
) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.routeIntro')} Icon={About}>
      <AboutWalkDialogContent {...props} />
    </MenuItemWithDialog>
  )
}
AboutWalkMenuItem.displayName = 'AboutWalkMenuItem'
export default AboutWalkMenuItem
