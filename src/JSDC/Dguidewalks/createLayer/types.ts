import { LayerApiRespItem } from '../ApiProvider'

export type CommonProps = Omit<
  LayerApiRespItem,
  'Basemap' | 'LineFeatures' | 'PointFeatures' | 'PolygonFeatures'
>
