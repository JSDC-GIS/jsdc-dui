export declare enum Navigation {
    Walk = 0,
    Car = 1,
    MassTransit = 2,
    Bike = 3
}
/**
 * [lat, lng]
 */
export interface IGeoNavigatorProps {
    origin: [number, number];
    destination: [number, number];
    type: Navigation;
}
declare const GeoNavigator: ({ origin, destination, type }: IGeoNavigatorProps) => null;
export default GeoNavigator;
