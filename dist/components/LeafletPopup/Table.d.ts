/// <reference types="react" />
import './index.scss';
export interface ILeafletPopupTableProps {
    name: string;
    value: {
        [k: string]: string | number;
    };
}
declare const LeafletPopupTable: ({ name, value }: ILeafletPopupTableProps) => JSX.Element;
export default LeafletPopupTable;
