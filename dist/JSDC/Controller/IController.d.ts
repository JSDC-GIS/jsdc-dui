import { Map } from 'leaflet';
export interface IController {
    name: string;
    viewer: Map | undefined;
    readonly isDestroy: boolean;
    init: (viewer: Map) => void;
    start: () => void;
    stop: () => void;
    destroy: () => void;
}
