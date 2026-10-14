import { Map, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet'
import React, { useEffect, useRef, useState } from 'react'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'
import JSDCMarkersLayer from '../../Layer/JSDCMarkersLayer'

export type UseClusterValidLayer = JSDCGeoJSONLayer | JSDCMarkersLayer

export type UseClusterParams = {
  layers?: Array<UseClusterValidLayer>
  config?: MarkerClusterGroupOptions
}

const useCluster = (asyncMap: Promise<Map>, options: UseClusterParams = {}) => {
  const {
    layers = [],
    config = {
      showCoverageOnHover: false,
    },
  } = options
  const cluster = useRef(new MarkerClusterGroup(config))
  const sourceLayers = useRef<Array<UseClusterValidLayer>>([])
  const [show, setShow] = useState(true)

  const showCluster = async () => {
    const map = await asyncMap
    map.removeLayer(cluster.current)
    // 先收起來源圖層再把 cluster 加回地圖，理由同 addLayer
    sourceLayers.current.forEach((layer) => (layer.show = false))
    map.addLayer(cluster.current)
    setShow(true)
  }

  const hideCluster = async () => {
    const map = await asyncMap
    map.removeLayer(cluster.current)
    sourceLayers.current.forEach((layer) => (layer.show = true))
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
    // 順序不能對調：來源圖層還在地圖上時先加進 cluster，markercluster 當下畫出的單點
    // 會在收起來源圖層時一起被移出地圖，之後平移縮放都不會補畫
    hideSourceLayer(layer)
    cluster.current.addLayer(layer.instance)
  }

  useEffect(() => {
    ;(async function () {
      const map = await asyncMap
      layers.forEach((layer) => addLayer(layer))
      map.addLayer(cluster.current)
    })()
  }, [])

  return {
    show,
    addLayer,
    toggleShowCluster,
  }
}

export default useCluster
