import { GeoJSON } from 'leaflet';
import JSDCLayer, { JSDCLayerConstructorOptions } from './JSDCLayer';
import { Point, Feature, GeoJsonProperties, LineString, Polygon, GeoJsonObject } from 'geojson';
declare class JSDCGeoJSONLayer extends JSDCLayer<GeoJSON> {
    constructor(options: JSDCLayerConstructorOptions);
    addFeature(feature: GeoJsonObject): void;
    groupFeaturesByGeomType(): {
        points: Feature<Point, GeoJsonProperties>[];
        polylines: Feature<LineString, GeoJsonProperties>[];
        polygons: Feature<Polygon, GeoJsonProperties>[];
    };
}
export default JSDCGeoJSONLayer;
