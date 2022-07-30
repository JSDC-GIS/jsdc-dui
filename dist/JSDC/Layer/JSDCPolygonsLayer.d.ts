import { LayerGroup, Polygon } from 'leaflet';
import JSDCLayer, { JSDCLayerConstructorOptions } from './JSDCLayer';
declare class JSDCPolygonsLayer extends JSDCLayer<LayerGroup<Polygon>> {
    constructor(options: JSDCLayerConstructorOptions);
    addPolygon(polygon: Polygon): void;
}
export default JSDCPolygonsLayer;
