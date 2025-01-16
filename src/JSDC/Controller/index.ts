import { Map } from "leaflet";
import AbstractController from "./AbstractController";
import LayerController from "./LayerController";

const STORE = {
  Layer: new LayerController("Layer"),
};

export default class Controller extends AbstractController {
  init(viewer: Map) {
    Object.values(STORE).forEach((contoller) => contoller.init(viewer));
  }

  get(name: keyof typeof STORE) {
    return STORE[name];
  }

  start() {
    Object.values(STORE).forEach((contoller) => contoller.start());
    return this;
  }

  destroy() {
    Object.values(STORE).forEach((contoller) => contoller.destroy());
  }
}
