/// <reference types="react" />
import { IMenuItemWithDialogProps } from '../..//LeftMenuBar/MenuList/MenuItemWithDialog';
import { ISceneDialogContentProps } from './SceneDialogContent';
export interface ISceneMenuItemProps extends Omit<IMenuItemWithDialogProps, 'title' | 'Icon' | 'children'>, ISceneDialogContentProps {
}
declare const SceneMenuItem: ({ onTarget, ...props }: ISceneMenuItemProps) => JSX.Element;
export default SceneMenuItem;
