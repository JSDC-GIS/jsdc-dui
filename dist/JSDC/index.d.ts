import ViewerPromise from "./module/ViewerPromise";
import Leaflet, { Map } from 'leaflet';
import Controller from "./Controller";
declare class JSDC {
    id: string;
    viewer: Map | undefined;
    viewerPromise: ViewerPromise;
    Controller: Controller;
    constructor(id: string);
    get asyncViewer(): Promise<Leaflet.Map>;
    createViewer(option?: Leaflet.MapOptions): Leaflet.Map;
}
export default JSDC;
