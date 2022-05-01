/// <reference types="react" />
import './SceneDialogContent.scss';
export interface ISceneDialogContentProps {
    onTarget: (title: string) => void;
}
declare const SceneDialogContent: ({ onTarget }: ISceneDialogContentProps) => JSX.Element;
export default SceneDialogContent;
