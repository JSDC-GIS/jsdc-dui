/// <reference types="react" />
import './WeatherCard.scss';
export interface IWeatherCardProps {
    title: string;
    img: string;
    degree: string;
    description: string;
    infoList: any[];
    imgNum: string;
}
declare const WeatherCard: (props: IWeatherCardProps) => JSX.Element;
export default WeatherCard;
