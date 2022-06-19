import { Map, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet'
import React, { useEffect, useRef, useState } from 'react'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'
import JSDCMarkersLayer from '../../Layer/JSDCMarkersLayer'

export type UseClusterValidLayer = JSDCGeoJSONLayer | JSDCMarkersLayer

export type UseClusterParams = {
  layers?: Array<UseClusterValidLayer>
  config?: MarkerClusterGroupOptions
}

const useCluster = (
    asyncMap: Promise<Map>,
    options: UseClusterParams = {}
  ) => {
  const {
    layers = [],
    config = {
      showCoverageOnHover: false
    }
  } = options
  const cluster = useRef(new MarkerClusterGroup(config))
  const sourceLayers = useRef<Array<UseClusterValidLayer>>([])
  const [show, setShow] = useState(true)

  const showCluster = async () => {
    const map = await asyncMap
    map.removeLayer(cluster.current)
    map.addLayer(cluster.current)
    sourceLayers.current.forEach(layer => layer.show = false)
    setShow(true)
  }

  const hideCluster = async () => {
    const map = await asyncMap
    map.removeLayer(cluster.current)
    sourceLayers.current.forEach(layer => layer.show = true)
    setShow(false)
  }

  const toggleShowCluster = () => {
    if (show) {
      return hideCluster()
    }
    showCluster()
  }

  const hideSourceLayer = (layer: UseClusterValidLayer) => {
    if (!layer.instance) return
    layer.show = false
    sourceLayers.current.push(layer)
  }

  const addLayer = (layer: UseClusterValidLayer) => {
    if (!layer.instance) return
    cluster.current.addLayer(layer.instance)
    hideSourceLayer(layer)
  }

  useEffect(() => {
    (async function () {
      const map = await asyncMap
      layers.forEach(layer => addLayer(layer))
      map.addLayer(cluster.current)
    })()
  }, [])

  return {
    show,
    addLayer,
    toggleShowCluster
  }
}

export default useCluster
