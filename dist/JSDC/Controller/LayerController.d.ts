import JSDCLayer from '../Layer/JSDCLayer';
import Event from '../utils/Event';
import AssociativeArray from '../utils/AssociativeArray';
import AbstractController from './AbstractController';
import { Layer } from 'leaflet';
export interface ILayerEvent {
    layer: JSDCLayer;
}
export interface IonChangeEvent extends ILayerEvent {
    type: 'add' | 'remove';
}
export declare type LayerInfo = Pick<JSDCLayer, 'id' | 'description' | 'show'>;
export declare type RemoveOptions = {
    removeFromMap?: boolean;
};
export declare type AddOptions = {
    hidden?: boolean;
    addToMap?: boolean;
};
export default class LayerController extends AbstractController {
    layers: AssociativeArray<JSDCLayer<Layer>>;
    onAddEvent: Event<ILayerEvent>;
    onRemoveEvent: Event<ILayerEvent>;
    onChangeEvent: Event<IonChangeEvent>;
    onUpdateEvent: Event<any>;
    layerInfos: Array<LayerInfo>;
    exceptionIds: Array<string>;
    showByNames(names: Array<string>, hideOthers?: boolean): void;
    setLayerList: () => LayerInfo[];
    add(_layer: JSDCLayer, { hidden, addToMap }?: AddOptions): void;
    get(layer: JSDCLayer): JSDCLayer<Layer>;
    getById(id: string): JSDCLayer<Layer>;
    getByName<P extends Layer>(name: string): JSDCLayer<P> | undefined;
    remove(layer: JSDCLayer, { removeFromMap }?: RemoveOptions): void;
    removeById(id: string, options?: RemoveOptions): void;
    removeAll(): void;
    destroy(): void;
}
