import React from 'react';
import './index.scss';
import { LatLng } from 'leaflet';
import useGeolocation from '../../../hooks/useGeolocation';
export interface ICheckInCardProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    subtitle: string;
    imgSrc: string;
    mainTextContent: string;
    credit: string;
    sceneLatLng: LatLng;
    innerRef?: React.ForwardedRef<HTMLDivElement>;
    onCheckin?: (src: string) => void;
    userLatLng?: ReturnType<typeof useGeolocation>['latLng'];
    checkinSrc?: string;
    validDistance?: number;
}
declare const CheckInCard: React.FC<Partial<ICheckInCardProps>>;
export default CheckInCard;
