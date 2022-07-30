import Event from '../JSDC/utils/Event';
declare const useGeolocation: () => {
    latLng: {
        lat: number;
        lng: number;
    } | undefined;
    changeEvent: Event<{
        lat: number;
        lng: number;
    }>;
};
export default useGeolocation;
