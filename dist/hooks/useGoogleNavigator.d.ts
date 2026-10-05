export declare enum GoogleNavigationType {
    Walk = 0,
    Car = 1,
    MassTransit = 2,
    Bike = 3
}
export interface GoogleNavigatorOptions {
    origin: [number, number];
    destination: [number, number];
    type: GoogleNavigationType;
}
declare const useGoogleNavigator: () => {
    openNavigator: ({ origin, destination, type, }: GoogleNavigatorOptions) => void;
    walkTo: (origin: {
        lat: number;
        lng: number;
    } | undefined, destination: {
        lat: number;
        lng: number;
    }) => void;
};
export default useGoogleNavigator;
