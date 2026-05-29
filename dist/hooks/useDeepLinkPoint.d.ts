import { Marker } from 'leaflet';
import { LayerApiRespVectorProps } from '../JSDC/Dguidewalks/ApiProvider';
export interface UseDeepLinkPointOptions {
    layerName: string;
    onResolve: (marker: Marker, properties: LayerApiRespVectorProps) => void;
    paramKey?: string;
    flyToZoom?: number;
    flyToDuration?: number;
    delayMs?: number;
}
declare const useDeepLinkPoint: ({ layerName, onResolve, paramKey, flyToZoom, flyToDuration, delayMs, }: UseDeepLinkPointOptions) => void;
export default useDeepLinkPoint;
