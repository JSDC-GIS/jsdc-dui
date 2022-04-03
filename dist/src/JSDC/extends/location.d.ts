import JSDC from "../";
import { Control, Map } from "leaflet";
export declare type Options = {
    position: string;
    Jsdc?: JSDC;
};
export declare type OnAdd = (map: Map) => HTMLDivElement;
declare const _default: (new (...args: any[]) => {
    options: Options;
    onAdd: OnAdd;
}) & typeof Control;
export default _default;
