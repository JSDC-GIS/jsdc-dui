import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuItemWithDialog, {
  IMenuItemWithDialogProps,
} from '../MenuList/MenuItemWithDialog'
import PathColor from '../../Icons/PathColor'
import PathColorDialogContent, {
  IPathColorDialogContentProps,
} from './PathColorDialogContent'

export interface IPathColorMenuItemProps
  extends
    Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>,
    IPathColorDialogContentProps {}

const PathColorMenuItem: React.FC<IPathColorMenuItemProps> = ({
  items,
  ...props
}: IPathColorMenuItemProps) => {
  const { t } = useTranslation()
  return (
    <MenuItemWithDialog {...props} title={t('menu.pathColor')} Icon={PathColor}>
      <PathColorDialogContent items={items} />
    </MenuItemWithDialog>
  )
}
PathColorMenuItem.displayName = 'PathColorMenuItem'
export default PathColorMenuItem
