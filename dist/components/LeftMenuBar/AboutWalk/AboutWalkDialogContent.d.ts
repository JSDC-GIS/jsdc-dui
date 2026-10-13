import React from 'react';
import './AboutWalkDialogContent.scss';
export interface IAboutWalkDialogContentProps {
    /** 沒有圖（undefined 或空字串）時不渲染圖片區塊。 */
    imgSrc?: string;
    title: string;
    subtitle: string;
    content: string;
}
declare const AboutWalkDialogContent: React.FC<IAboutWalkDialogContentProps>;
export default AboutWalkDialogContent;
