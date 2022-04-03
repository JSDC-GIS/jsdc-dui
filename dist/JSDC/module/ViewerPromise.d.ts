import { Map } from 'leaflet';
export default class ViewerPromise {
    viewer: Map | undefined;
    stack: Array<(viewer: Map) => void>;
    constructor();
    get asyncViewer(): Promise<Map>;
    setViewer(viewer: Map): void;
    execute(callback: (viewer: Map) => void): void;
}
