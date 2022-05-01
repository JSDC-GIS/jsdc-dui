/// <reference types="react" />
import './index.scss';
export interface ISceneCardProps {
    title: string;
    subtitle: string;
    imgSrc: string;
    mainTextContent: string;
    credit: string;
}
declare const SceneCard: ({ title, subtitle, imgSrc, mainTextContent, credit, }: Partial<ISceneCardProps>) => JSX.Element;
export default SceneCard;
