import React from 'react';
import './index.scss';
export interface IVisitorCountProps {
    value: number;
}
declare const VisitorCount: ({ value }: IVisitorCountProps) => React.JSX.Element;
export default VisitorCount;
