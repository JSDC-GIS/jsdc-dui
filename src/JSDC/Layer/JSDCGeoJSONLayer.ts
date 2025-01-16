import { GeoJSON } from 'leaflet'
import JSDCLayer, { JSDCLayerConstructorOptions } from './JSDCLayer'
import {
  FeatureCollection,
  Point,
  Feature,
  GeoJsonProperties,
  LineString,
  Polygon,
  GeoJsonObject,
} from 'geojson'

class JSDCGeoJSONLayer extends JSDCLayer<GeoJSON> {
  constructor(options: JSDCLayerConstructorOptions) {
    super(options)
    this.instance = new GeoJSON()
  }

  addFeature(feature: GeoJsonObject) {
    this.instance?.addData(feature)
  }

  groupFeaturesByGeomType() {
    const geoJSON = this.instance?.toGeoJSON() as FeatureCollection
    const points = geoJSON.features.filter(
      (feature) => feature.geometry.type === 'Point',
    ) as Feature<Point, GeoJsonProperties>[]
    const polylines = geoJSON.features.filter(
      (feature) => feature.geometry.type === 'LineString',
    ) as Feature<LineString, GeoJsonProperties>[]
    const polygons = geoJSON.features.filter(
      (feature) => feature.geometry.type === 'Polygon',
    ) as Feature<Polygon, GeoJsonProperties>[]
    return {
      points,
      polylines,
      polygons,
    }
  }
}

export default JSDCGeoJSONLayer
