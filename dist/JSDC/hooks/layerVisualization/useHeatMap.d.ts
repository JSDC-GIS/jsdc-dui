import { LatLng, Layer, Map } from 'leaflet';
import JSDCMarkersLayer from '../../Layer/JSDCMarkersLayer';
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer';
export declare type HeatMapOverLayParam = {
    /**
     * radius should be small ONLY if scaleRadius is true (or small radius is intended)
     * if scaleRadius is false it will be the constant radius used in pixels
     */
    radius: number;
    maxOpacity: number;
    /**
     * scales the radius based on map zoom
     */
    scaleRadius: boolean;
    /**
     * if set to false the heatmap uses the global maximum for colorization
     * if activated: uses the data maximum within the current map boundaries
     * (there will always be a red spot with useLocalExtremas true)
     */
    useLocalExtrema: boolean;
    /**
     * which field name in your data represents the latitude - default "lat"
     */
    latField?: string;
    /**
     * which field name in your data represents the longitude - default "lng"
     */
    lngField?: string;
    /**
     * which field name in your data represents the data value - default "value"
     */
    valueField?: string;
};
export interface IHeatMapOverLay extends Layer {
    setData: (param: {
        max: 100;
        data: LatLng[];
    }) => void;
    addData: (param: LatLng[]) => void;
}
export declare type HeatMapOverLay = {
    new (param: HeatMapOverLayParam): IHeatMapOverLay;
};
export declare type UseHeatMapValidLayer = JSDCMarkersLayer | JSDCGeoJSONLayer;
export declare type UseHeatMapParams = {
    layers?: Array<UseHeatMapValidLayer>;
    config?: HeatMapOverLayParam;
};
declare const useHeatMap: (asyncMap: Promise<Map>, options?: UseHeatMapParams) => {
    addLayer: (layer: UseHeatMapValidLayer) => void;
    hideHeatMap: () => Promise<void>;
    showHeatMap: () => Promise<void>;
    toggleShowHeatMap: () => Promise<void> | undefined;
    show: boolean;
    heatLayer: IHeatMapOverLay;
};
export default useHeatMap;
