import React, { useEffect, useRef, useState } from 'react'
import JSDCLayer from '../../Layer/JSDCLayer'
import {
  CircleMarker,
  LatLng,
  Layer,
  LayerGroup,
  Map,
  Marker,
  Polygon,
  Polyline,
} from 'leaflet'
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import JSDCMarkersLayer from '../../Layer/JSDCMarkersLayer'
import JSDCGeoJSONLayer from '../../Layer/JSDCGeoJSONLayer'

export type HeatMapOverLayParam = {
  /**
   * radius should be small ONLY if scaleRadius is true (or small radius is intended)
   * if scaleRadius is false it will be the constant radius used in pixels
   */
  radius: number
  maxOpacity: number
  /**
   * scales the radius based on map zoom
   */
  scaleRadius: boolean
  /**
   * if set to false the heatmap uses the global maximum for colorization
   * if activated: uses the data maximum within the current map boundaries
   * (there will always be a red spot with useLocalExtremas true)
   */
  useLocalExtrema: boolean
  /**
   * which field name in your data represents the latitude - default "lat"
   */
  latField?: string
  /**
   * which field name in your data represents the longitude - default "lng"
   */
  lngField?: string
  /**
   * which field name in your data represents the data value - default "value"
   */
  valueField?: string
}

export interface IHeatMapOverLay extends Layer {
  setData: (param: { max: 100; data: LatLng[] }) => void
  addData: (param: LatLng[]) => void
}

export type HeatMapOverLay = {
  new (param: HeatMapOverLayParam): IHeatMapOverLay
}

const HeatmapOverlay: HeatMapOverLay = require('leaflet-heatmap')

export type UseHeatMapValidLayer = JSDCMarkersLayer | JSDCGeoJSONLayer

export type UseHeatMapParams = {
  layers?: Array<UseHeatMapValidLayer>
  config?: HeatMapOverLayParam
}

const extractLatLngs = (layer: UseHeatMapValidLayer) => {
  const instance = layer.instance
  if (!instance) return []
  if (layer instanceof JSDCMarkersLayer) {
    return layer.getLatLngs()
  }
  if (layer instanceof JSDCGeoJSONLayer) {
    const points = layer.groupFeaturesByGeomType().points
    return points.map((point) => {
      const [lng, lat] = point.geometry.coordinates
      return new LatLng(lat, lng)
    })
  }
  return []
}

const useHeatMap = (asyncMap: Promise<Map>, options: UseHeatMapParams = {}) => {
  const {
    layers = [],
    config = {
      scaleRadius: false,
      radius: 50,
      useLocalExtrema: true,
      maxOpacity: 0.5,
    },
  } = options
  const heatLayer = useRef<IHeatMapOverLay>(new HeatmapOverlay(config))
  const [show, setShow] = useState(true)

  const showHeatMap = async () => {
    const map = await asyncMap
    if (map.hasLayer(heatLayer.current)) return
    map.addLayer(heatLayer.current)
    setShow(true)
  }

  const hideHeatMap = async () => {
    const map = await asyncMap
    if (!map.hasLayer(heatLayer.current)) return
    map.removeLayer(heatLayer.current)
    setShow(false)
  }

  const addLayer = (layer: UseHeatMapValidLayer) => {
    const latLngs = extractLatLngs(layer)
    heatLayer.current.addData(latLngs)
  }

  const toggleShowHeatMap = () => {
    if (show) {
      return hideHeatMap()
    }
    showHeatMap()
  }

  useEffect(() => {
    ;(async function () {
      const map = await asyncMap
      const latLngs = layers.map((layer) => extractLatLngs(layer)).flat()
      heatLayer.current.setData({ max: 100, data: latLngs })
      map.addLayer(heatLayer.current)
    })()
  }, [])

  return {
    addLayer,
    hideHeatMap,
    showHeatMap,
    toggleShowHeatMap,
    show,
    heatLayer: heatLayer.current,
  }
}

export default useHeatMap
