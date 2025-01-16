import JSDCLayer from "../Layer/JSDCLayer";
import { get, pick } from "lodash";
import Event from "../utils/Event";
import AssociativeArray from "../utils/AssociativeArray";
import AbstractController from "./AbstractController";
import { Layer } from "leaflet";

export interface ILayerEvent {
  layer: JSDCLayer;
}

export interface IonChangeEvent extends ILayerEvent {
  type: "add" | "remove";
}

export type LayerInfo = Pick<JSDCLayer, "id" | "description" | "show">;

export type RemoveOptions = { removeFromMap?: boolean };

export type AddOptions = { hidden?: boolean; addToMap?: boolean };

export default class LayerController extends AbstractController {
  layers = new AssociativeArray<JSDCLayer>();
  onAddEvent = new Event<ILayerEvent>();
  onRemoveEvent = new Event<ILayerEvent>();
  onChangeEvent = new Event<IonChangeEvent>();
  onUpdateEvent = new Event<any>();
  layerInfos: Array<LayerInfo> = [];
  exceptionIds: Array<string> = [];

  showByNames(names: Array<string>, hideOthers = false) {
    const ids = names
      .map((name) => get(this.getByName(name), "id"))
      .filter((id) => id !== undefined) as Array<string>;
    if (hideOthers) {
      this.layers.omit(ids).forEach((layer) => (layer.show = false));
    } else {
      this.layers.gets(ids).forEach((layer) => (layer.show = true));
    }
    this.setLayerList();
  }
  setLayerList = () => {
    let layers = this.layers.omit(this.exceptionIds);
    this.layerInfos = layers.map((layer) =>
      pick(layer, ["id", "description", "show"]),
    );
    this.onUpdateEvent.raise();
    return this.layerInfos;
  };
  add(_layer: JSDCLayer, { hidden = false, addToMap = true }: AddOptions = {}) {
    const layer = addToMap ? _layer.isInstanceExistStrict() : _layer;
    hidden && this.exceptionIds.push(layer.id);
    addToMap && this.validateViewer().addLayer(layer.instance!);
    this.layers.set(layer.id, layer);
    this.setLayerList();
    this.onAddEvent.raise({ layer });
    this.onChangeEvent.raise({ layer, type: "add" });
    layer.onToggleShowEvent.addEventListener(this.setLayerList);
  }
  get(layer: JSDCLayer) {
    return this.getById(layer.id);
  }
  getById(id: string) {
    return this.layers.get(id);
  }
  getByName<P extends Layer>(name: string) {
    return this.layers.values.find(
      (layer) => layer.description.name === name,
    ) as JSDCLayer<P> | undefined;
  }
  remove(layer: JSDCLayer, { removeFromMap = true }: RemoveOptions = {}) {
    removeFromMap &&
      this.validateViewer().removeLayer(layer.isInstanceExistStrict().instance);

    const index = this.exceptionIds.indexOf(layer.id);
    if (index > -1) this.exceptionIds.splice(index, 1);
    this.layers.remove(layer.id);
    this.setLayerList();
    this.onRemoveEvent.raise({ layer });
    this.onChangeEvent.raise({ layer, type: "remove" });
    layer.onToggleShowEvent.removeEventListener(this.setLayerList);
  }
  removeById(id: string, options: RemoveOptions = {}) {
    let layer = this.getById(id);
    this.remove(layer, options);
  }

  removeAll() {
    while (this.layers.values.length > 0) {
      this.remove(this.layers.values[0], { removeFromMap: true });
    }
    this.exceptionIds = [];
  }

  destroy() {
    super.destroy();
    this.removeAll();
    this.onAddEvent.removeAllEvents();
    this.onChangeEvent.removeAllEvents();
    this.onRemoveEvent.removeAllEvents();
  }
}
