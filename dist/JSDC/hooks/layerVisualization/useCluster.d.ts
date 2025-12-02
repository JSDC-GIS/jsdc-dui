import { Map, MarkerClusterGroupOptions } from 'leaflet';
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer';
import JSDCMarkersLayer from '../../Layer/JSDCMarkersLayer';
export type UseClusterValidLayer = JSDCGeoJSONLayer | JSDCMarkersLayer;
export type UseClusterParams = {
    layers?: Array<UseClusterValidLayer>;
    config?: MarkerClusterGroupOptions;
};
declare const useCluster: (asyncMap: Promise<Map>, options?: UseClusterParams) => {
    show: boolean;
    addLayer: (layer: UseClusterValidLayer) => void;
    toggleShowCluster: () => Promise<void> | undefined;
};
export default useCluster;
