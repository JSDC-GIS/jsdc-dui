import React from 'react';
import { CountyName } from './src/api';
import './WeatherDialogContent.scss';
export interface IWeatherDialogContentProps {
    locations: Array<{
        county: CountyName;
        town: string;
    }>;
    token: string;
    onSelectLocation?: (latlng: [number, number]) => void;
}
declare const WeatherDialogContent: React.FC<IWeatherDialogContentProps>;
export default WeatherDialogContent;
