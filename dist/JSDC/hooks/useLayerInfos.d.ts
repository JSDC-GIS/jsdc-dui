import JSDC from '..';
import { LayerInfo } from '../Controller/LayerController';
declare const useLayerInfos: (Jsdc: JSDC) => {
    layerInfos: LayerInfo[];
};
export default useLayerInfos;
