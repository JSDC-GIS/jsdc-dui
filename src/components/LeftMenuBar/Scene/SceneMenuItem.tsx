import MenuItemWithDialog, { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog'
import icon from '../../../icon'
import React from 'react'
import SceneDialogContent, { ISceneDialogContentProps } from './SceneDialogContent'
import Mappin from '../../Icons/Mappin'

export interface ISceneMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ISceneDialogContentProps {

}

const SceneMenuItem = ({
  onTarget,
  cardsReducer,
  ...props
}: ISceneMenuItemProps) => {
  return (
    <MenuItemWithDialog {...props} title='景點介紹' Icon={Mappin}>
      <SceneDialogContent onTarget={onTarget} cardsReducer={cardsReducer}/>
    </MenuItemWithDialog>
  )
}

export default SceneMenuItem
