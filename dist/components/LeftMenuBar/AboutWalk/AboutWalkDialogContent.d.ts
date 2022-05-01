/// <reference types="react" />
import './AboutWalkDialogContent.scss';
export interface IAboutWalkDialogContentProps {
    imgSrc: string;
    title: string;
    subtitle: string;
    content: string;
}
declare const AboutWalkDialogContent: ({ imgSrc, title, subtitle, content }: IAboutWalkDialogContentProps) => JSX.Element;
export default AboutWalkDialogContent;
