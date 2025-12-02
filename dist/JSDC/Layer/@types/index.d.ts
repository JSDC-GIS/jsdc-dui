export type JSDCLayerDescription = {
    name: string;
    type: string;
    [k: string]: any;
};
export default interface JSDCLayerBehavior<P = {}> {
    description: JSDCLayerDescription;
    id: string;
    instance: P | undefined;
    show: boolean;
}
