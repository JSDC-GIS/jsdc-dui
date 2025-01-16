import JSDC from '..'
import { LayerInfo } from '../Controller/LayerController'
import { useEffect, useState } from 'react'

const useLayerInfos = (Jsdc: JSDC) => {
  const [layerInfos, setlayerInfos] = useState<LayerInfo[]>([])
  useEffect(() => {
    const layerController = Jsdc.Controller.get('Layer')
    const removeUpdateEvent = layerController.onUpdateEvent.addEventListener(
      () => setlayerInfos(layerController.layerInfos),
    )
    return () => {
      removeUpdateEvent && removeUpdateEvent()
    }
  }, [])

  return {
    layerInfos,
  }
}

export default useLayerInfos
