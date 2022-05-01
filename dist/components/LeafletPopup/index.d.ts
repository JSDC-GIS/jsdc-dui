/// <reference types="react" />
import { Layer } from 'leaflet';
import { ILeafletPopupTableProps } from './Table';
import Dguidewalks from '../../JSDC/Dguidewalks';
export declare type BindPopupWithComponentOptions<P> = {
    Component: (props: P) => JSX.Element;
    props: P;
    onLayerClick?: () => void;
};
export declare function bindPopupWithComponent<P>(layer: Layer, { Component, props, onLayerClick }: BindPopupWithComponentOptions<P>): void;
export declare type BindPopupWithSceneCardOptions = {
    dgw: Dguidewalks;
    title: string;
};
export declare const bindPopupWithSceneCard: (layer: Layer, { dgw, title }: BindPopupWithSceneCardOptions) => void;
export declare const bindPopupWithTable: (layer: Layer, options: ILeafletPopupTableProps) => void;
declare const LeafletPopup: {
    SceneCard: ({ title, subtitle, imgSrc, mainTextContent, credit, }: Partial<import("./SceneCard").ISceneCardProps>) => JSX.Element;
    Table: ({ name, value }: ILeafletPopupTableProps) => JSX.Element;
};
export default LeafletPopup;
