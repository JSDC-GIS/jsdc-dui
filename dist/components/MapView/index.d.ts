/// <reference types="react" />
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import JSDC from '../../JSDC';
export interface IMapViewProps {
    Jsdc: JSDC;
}
declare const MapView: ({ Jsdc }: IMapViewProps) => JSX.Element;
export default MapView;
