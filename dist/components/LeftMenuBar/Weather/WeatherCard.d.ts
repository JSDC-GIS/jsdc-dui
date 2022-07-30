import React from 'react';
import './WeatherCard.scss';
export interface IWeatherCardProps {
    title: string;
    img: string;
    degree: string;
    description: string;
    infoList: any[];
    imgNum: string;
}
declare const WeatherCard: React.FC<IWeatherCardProps>;
export default WeatherCard;
