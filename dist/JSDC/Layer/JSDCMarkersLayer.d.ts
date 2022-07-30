import { LayerGroup, Marker } from 'leaflet';
import JSDCLayer, { JSDCLayerConstructorOptions } from './JSDCLayer';
declare class JSDCMarkersLayer extends JSDCLayer<LayerGroup<Marker>> {
    constructor(options: JSDCLayerConstructorOptions);
    addMarker(marker: Marker): void;
    getLatLngs(): import("leaflet").LatLng[];
}
export default JSDCMarkersLayer;
