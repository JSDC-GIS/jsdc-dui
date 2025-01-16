import { Map } from 'leaflet';
import { IController } from './IController';
export default abstract class AbstractController implements IController {
    viewer: Map | undefined;
    name: string;
    _isDestroy: boolean;
    constructor(name: string);
    get isDestroy(): boolean;
    init(viewer: Map): void;
    validateViewer(): Map;
    start(): this;
    stop(): void;
    destroy(): void;
}
