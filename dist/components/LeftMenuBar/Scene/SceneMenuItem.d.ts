import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import React from 'react';
import { ISceneDialogContentProps } from './SceneDialogContent';
export interface ISceneMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ISceneDialogContentProps {
}
declare const SceneMenuItem: React.FC<ISceneMenuItemProps>;
export default SceneMenuItem;
