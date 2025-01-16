/// <reference types="react" />
import { Layer } from 'leaflet';
import { ILeafletPopupTableProps } from './Table';
import { renderToString } from 'react-dom/server';
import Dguidewalks from '../../JSDC/Dguidewalks';
export declare type BindPopupWithComponentOptions<P> = {
    Component: (props: P) => JSX.Element | null;
    props: P;
    onLayerClick?: () => void;
};
export declare function bindPopupWithComponent<P>(layer: Layer, stringRenderer: typeof renderToString, { Component, props, onLayerClick }: BindPopupWithComponentOptions<P>): void;
export declare type BindPopupWithSceneCardOptions = {
    dgw: Dguidewalks;
    title: string;
};
export declare const bindPopupWithSceneCard: (layer: Layer, stringRenderer: typeof renderToString, { dgw, title }: BindPopupWithSceneCardOptions) => void;
export declare const bindPopupWithTable: (layer: Layer, stringRenderer: typeof renderToString, options: ILeafletPopupTableProps) => void;
declare const LeafletPopup: {
    SceneCard: import("react").FC<Partial<import("./SceneCard").ISceneCardProps>>;
    Table: import("react").FC<ILeafletPopupTableProps>;
};
export default LeafletPopup;
