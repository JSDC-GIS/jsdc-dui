import React, { useEffect } from 'react'

import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import JSDC from '../../JSDC'

export interface IMapViewProps {
  Jsdc: JSDC
}

const MapView: React.FC<IMapViewProps> = ({
  Jsdc
}: IMapViewProps) => {
  useEffect(() => {
    Jsdc.createViewer()
  }, [])
  return (
    <div id={Jsdc.id} style={{ width: '100%', height: '100%' }}></div>
  )
}
MapView.displayName = 'MapView'
export default MapView
