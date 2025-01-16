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
};
export default useGoogleNavigator;
