import { FeatureCollection } from "geojson";
import JSDCLayer from "../../Layer/JSDCLayer";
import { geoJSON } from "leaflet";
import { omit } from "lodash";
import { LayerApiRespVectorType } from "../ApiProvider";
import { CommonProps } from "./types";

const createGeoJSONLayer = (options: LayerApiRespVectorType[], commonOptions: CommonProps) => {
  type GeoJSONTyoe = FeatureCollection<any, Omit<LayerApiRespVectorType, 'geometry'>>
  const geojson: GeoJSONTyoe = {
    type: 'FeatureCollection',
    features: options.map(item => ({
      geometry: item.geometry,
      type: "Feature",
      properties: omit(item, ['geometry'])
    }))
  }
  const instance = geoJSON<GeoJSONTyoe>(geojson)
  const layer = new JSDCLayer(
    {
      id: commonOptions.id,
      description: {
        ...commonOptions,
        name: commonOptions.name,
      }
    }
  )
  layer.setInstance(instance)
  return layer
}

export default createGeoJSONLayer
