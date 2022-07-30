import { LayerGroup, Polyline } from 'leaflet';
import JSDCLayer, { JSDCLayerConstructorOptions } from './JSDCLayer';
declare class JSDCPolylinesLayer extends JSDCLayer<LayerGroup<Polyline>> {
    constructor(options: JSDCLayerConstructorOptions);
    addPolyline(polyline: Polyline): void;
}
export default JSDCPolylinesLayer;
