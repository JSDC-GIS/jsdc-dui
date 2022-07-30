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
declare const MenuList: React.FC<IMenuListProps>;
export default MenuList;
