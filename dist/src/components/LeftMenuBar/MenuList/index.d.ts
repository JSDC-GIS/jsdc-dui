import React from 'react';
import './index.scss';
export interface IMenuListProps {
    title?: string;
    subtitle?: string;
    headerImg?: string;
    headerMBImg?: string;
    children?: React.ReactNode;
    endChildren?: React.ReactNode;
}
declare const MenuList: ({ title, subtitle, headerImg, headerMBImg, children, endChildren }: IMenuListProps) => JSX.Element;
export default MenuList;
