import { IMapViewProps } from '../MapView';
import React from 'react';
import './index.scss';
export interface IMapViewContainerProps {
    headerImgSrc?: string;
    menuChildren?: React.ReactNode;
    mapChildren?: React.ReactNode;
    Jsdc: IMapViewProps['Jsdc'];
}
declare const MapViewContainer: React.FC<IMapViewContainerProps>;
export default MapViewContainer;
