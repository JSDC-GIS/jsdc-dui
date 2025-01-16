import { FeatureCollection } from 'geojson'
import { omit } from 'lodash'
import { LayerApiRespVectorType } from '../ApiProvider'
import { CommonProps } from './types'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'

const createGeoJSONLayer = (
  options: LayerApiRespVectorType[],
  commonOptions: CommonProps,
) => {
  type GeoJSONTyoe = FeatureCollection<
    any,
    Omit<LayerApiRespVectorType, 'geometry'>
  >
  const geojson: GeoJSONTyoe = {
    type: 'FeatureCollection',
    features: options.map((item) => ({
      geometry: item.geometry,
      type: 'Feature',
      properties: omit(item, ['geometry']),
    })),
  }
  const layer = new JSDCGeoJSONLayer({
    id: commonOptions.id,
    description: {
      ...commonOptions,
      name: commonOptions.name,
    },
  })
  layer.addFeature(geojson)
  return layer
}

export default createGeoJSONLayer
