import { GeoJsonProperties } from 'geojson';
import Event from '../utils/Event';
import { Layer, Map, TileLayer, GeoJSON } from 'leaflet';
import JSDCLayerBehavior, { JSDCLayerDescription } from './@types';
export interface JSDCLayerConstructorOptions extends Pick<JSDCLayerBehavior, 'id' | 'description'> {
}
declare type ValidationParam = {
    strictMode?: boolean;
};
declare class JSDCLayer<P extends Layer = Layer> implements JSDCLayerBehavior<P> {
    private _show;
    private _viewer;
    instance: P | undefined;
    description: JSDCLayerDescription;
    id: string;
    onToggleShowEvent: Event<any>;
    constructor(options: JSDCLayerConstructorOptions);
    get show(): boolean;
    set show(val: boolean);
    isInstanceType<T>(type: T | any, validOptions?: ValidationParam): JSDCLayer<P> & {
        instance: T;
    } | false;
    isTileLayer(validOptions?: ValidationParam): false | (JSDCLayer<P> & {
        instance: TileLayer;
    });
    isGeoJSON(validOptions?: ValidationParam): false | (JSDCLayer<P> & {
        instance: GeoJSON<any>;
    });
    setOpacity(opacity: number): void;
    addToMap(viewer: Map): void;
    isInstanceExist({ strictMode }?: ValidationParam): false | (JSDCLayer<P> & {
        instance: Layer;
    });
    isInstanceExistStrict(): JSDCLayer<P> & {
        instance: Layer;
    };
    setInstance(instance: P | undefined): void;
    getPrivateViewer(): Map | undefined;
    forEachLayerAsGeoJSON<L, O = GeoJsonProperties>(eachLayer?: (layer: L, props: O) => void): void;
}
export default JSDCLayer;
