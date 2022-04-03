import { Map } from "leaflet";
import AbstractController from "./AbstractController";
import LayerController from "./LayerController";
declare const STORE: {
    Layer: LayerController;
};
export default class Controller extends AbstractController {
    init(viewer: Map): void;
    get(name: keyof typeof STORE): LayerController;
    start(): this;
    destroy(): void;
}
export {};
