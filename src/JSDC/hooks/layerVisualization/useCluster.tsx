import { Map, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet'
import React, { useEffect, useRef, useState } from 'react'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'
import JSDCMarkersLayer from '../../Layer/JSDCMarkersLayer'
import { runWhenMapIdle, trackMapMotion } from '../../utils/mapMotion'

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
  const mapRef = useRef<Map>()
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
    // 地圖移動中（例如開場的 flyToBounds）不能把點加進 cluster：移動期間沒有 moveend，
    // markercluster 會用移動開始時的縮放層級與範圍決定要畫哪些點；移動結束的 zoomend
    // 只展開舊層級的 cluster，舊層級就已是單點、但不在舊範圍內的點不會補畫，
    // 隨後的 moveend 又因 cluster 還在縮放動畫中被略過。等移動結束再加。
    const instance = layer.instance
    const add = () => cluster.current.addLayer(instance)
    if (mapRef.current) {
      runWhenMapIdle(mapRef.current, add)
      return
    }
    asyncMap.then((map) => runWhenMapIdle(map, add))
  }

  useEffect(() => {
    ;(async function () {
      const map = await asyncMap
      trackMapMotion(map)
      mapRef.current = map
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
