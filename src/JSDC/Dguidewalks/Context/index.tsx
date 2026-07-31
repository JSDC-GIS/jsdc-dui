import JSDC from '../../'
import React, { createContext, useEffect, useState } from 'react'
import Dguidewalks from '..'
import ConfigProvider from '../ConfigProvider'
import { IArticleProxyParser } from '../proxyParser/@types'
import useGeolocation from '../../../hooks/useGeolocation'

/**
 * 圖層顯示名的語系對照，key 為後端回傳的原始 `name`（同時是各種查找的 key，不做正規化）。
 * 查不到或該語系沒填時，一律 fallback 顯示原始 `name`。
 */
export type LayerNames = Record<string, { en?: string }>

export type DguidewalksContextType = {
  dgw: Dguidewalks
  geolocation: ReturnType<typeof useGeolocation>
  layerLegendImages: Record<string, string>
  layerNames: LayerNames
}

const InitialDguidewalksContext = {}

const DguidewalksContext = createContext<DguidewalksContextType>(
  InitialDguidewalksContext as DguidewalksContextType,
)

export interface IDguidewalksProviderProps {
  children?: React.ReactNode
  Jsdc: JSDC
  layersHiddenFromUI: Array<string>
  layersShowOnMapByDefault: Array<string>
  layerNameOrder?: Array<string>
  articleParser: IArticleProxyParser
  config: ConfigProvider
  layerLegendImages?: Record<string, string>
  layerNames?: LayerNames
}

const DguidewalksProvider: React.FC<IDguidewalksProviderProps> = ({
  children,
  Jsdc,
  layersHiddenFromUI,
  layersShowOnMapByDefault,
  layerNameOrder = [],
  articleParser,
  config,
  layerLegendImages = {},
  layerNames = {},
}) => {
  const [dgw] = useState(
    new Dguidewalks({
      config,
      layerNameOrder,
      articleParser,
    }),
  )
  const geolocation = useGeolocation()

  const init = async () => {
    const layerController = Jsdc.Controller.get('Layer')
    const jsdcLayers = await dgw.loadGisData()
    jsdcLayers.forEach((jsdcLayer) =>
      layerController.add(jsdcLayer, {
        hidden: layersHiddenFromUI.includes(jsdcLayer.description.name),
      }),
    )
    layerController.showByNames(layersShowOnMapByDefault, true)
    dgw.gisDataLoadEvent.raise()
  }

  useEffect(() => {
    init()
  }, [])

  const value = {
    dgw,
    geolocation,
    layerLegendImages,
    layerNames,
  }
  return (
    <DguidewalksContext.Provider value={value}>
      {children}
    </DguidewalksContext.Provider>
  )
}
DguidewalksProvider.displayName = 'DguidewalksProvider'
export { DguidewalksContext, DguidewalksProvider }
