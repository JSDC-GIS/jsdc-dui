import JSDC from '../';
import { Control, Map } from 'leaflet';
export type Options = {
    position: string;
    Jsdc?: JSDC;
};
export type OnAdd = (map: Map) => HTMLDivElement;
declare const _default: (new (...args: any[]) => {
    options: Options;
    onAdd: OnAdd;
}) & {
    new (options?: import("leaflet").ControlOptions | undefined): Control<import("leaflet").ControlOptions>;
    extend<T extends object, Options_1 extends import("leaflet").ControlOptions = import("leaflet").ControlOptions>(props: T): (new (...args: any[]) => T) & {
        new (options?: Options_1 | undefined): Control<Options_1>;
        extend<T extends object, Options_1 extends import("leaflet").ControlOptions = import("leaflet").ControlOptions>(props: T): (new (...args: any[]) => T) & any;
        Zoom: typeof Control.Zoom;
        Attribution: typeof Control.Attribution;
        Layers: typeof Control.Layers;
        Scale: typeof Control.Scale;
        include(props: any): any;
        mergeOptions(props: any): any;
        addInitHook(initHookFn: () => void): any;
        addInitHook(methodName: string, ...args: any[]): any;
        callInitHooks(): void;
    };
    Zoom: typeof Control.Zoom;
    Attribution: typeof Control.Attribution;
    Layers: typeof Control.Layers;
    Scale: typeof Control.Scale;
    include(props: any): any;
    mergeOptions(props: any): any;
    addInitHook(initHookFn: () => void): any;
    addInitHook(methodName: string, ...args: any[]): any;
    callInitHooks(): void;
};
export default _default;
