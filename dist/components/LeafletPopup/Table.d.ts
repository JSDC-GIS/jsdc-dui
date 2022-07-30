import React from 'react';
import './index.scss';
export interface ILeafletPopupTableProps {
    name: string;
    value: {
        [k: string]: string | number;
    };
}
declare const LeafletPopupTable: React.FC<ILeafletPopupTableProps>;
export default LeafletPopupTable;
