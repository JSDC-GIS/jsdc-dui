import { useContext, useEffect } from 'react'
import { GeoJSON, Marker } from 'leaflet'
import { JSDCContext } from '../JSDC/Context'
import { DguidewalksContext } from '../JSDC/Dguidewalks/Context'
import JSDCGeoJSONLayer from '../JSDC/Layer/JSDCGeoJSONLayer'
import { LayerApiRespVectorProps } from '../JSDC/Dguidewalks/ApiProvider'

export interface UseDeepLinkPointOptions {
  layerName: string
  onResolve: (marker: Marker, properties: LayerApiRespVectorProps) => void
  paramKey?: string
  flyToZoom?: number
  flyToDuration?: number
  delayMs?: number
}

const useDeepLinkPoint = ({
  layerName,
  onResolve,
  paramKey = 'id',
  flyToZoom = 17,
  flyToDuration = 4,
  delayMs = 3000,
}: UseDeepLinkPointOptions) => {
  const { Jsdc } = useContext(JSDCContext)
  const { dgw } = useContext(DguidewalksContext)

  useEffect(() => {
    const handler = async () => {
      const params = new URLSearchParams(window.location.search)
      const targetId = params.get(paramKey)
      if (!targetId) return

      const layer = Jsdc.Controller.get('Layer').getByName<GeoJSON>(
        layerName,
      ) as JSDCGeoJSONLayer | undefined
      if (!layer) return

      let targetMarker: Marker | undefined
      let targetProps: LayerApiRespVectorProps | undefined
      layer.forEachLayerAsGeoJSON<
        Marker,
        LayerApiRespVectorProps & { id?: string }
      >((l, props) => {
        const featureId = (l as any).feature?.id ?? props.id
        if (String(featureId) === targetId) {
          targetMarker = l
          targetProps = props
        }
      })
      if (!targetMarker || !targetProps) {
        console.warn(
          `[useDeepLinkPoint] no feature with id="${targetId}" in layer "${layerName}"`,
        )
        return
      }

      const map = await Jsdc.asyncViewer
      const marker = targetMarker
      const props = targetProps
      map.flyTo(marker.getLatLng(), flyToZoom, { duration: flyToDuration })
      map.once('moveend', () => {
        setTimeout(() => onResolve(marker, props), delayMs)
      })
    }

    dgw.gisDataLoadEvent.addEventListener(handler)
  }, [])
}

export default useDeepLinkPoint
