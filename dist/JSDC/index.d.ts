import ViewerPromise from "./module/ViewerPromise";
import Leaflet, { LatLngBounds, Map } from 'leaflet';
import Controller from "./Controller";
declare class JSDC {
    id: string;
    viewer: Map | undefined;
    viewerPromise: ViewerPromise;
    Controller: Controller;
    mapOption: Leaflet.MapOptions & {
        bound?: LatLngBounds;
    };
    constructor(id: string, mapOption?: Leaflet.MapOptions & {
        bound?: LatLngBounds;
    });
    get asyncViewer(): Promise<Leaflet.Map>;
    createViewer(option?: Leaflet.MapOptions & {
        bound?: Leaflet.LatLngBounds | undefined;
    }): Leaflet.Map | undefined;
}
export default JSDC;
