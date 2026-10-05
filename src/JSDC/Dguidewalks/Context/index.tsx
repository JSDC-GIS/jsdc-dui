import JSDC from '../../'
import React, { createContext, useEffect, useState } from 'react'
import Dguidewalks, { SCENE_LAYER_NAME } from '..'
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
  /** 不傳就用內建的 Strapi 景點文章來源。舊的 Drupal parser 仍可傳入。 */
  articleParser?: IArticleProxyParser
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
    // 景點圖層由 jsdc-dui 管理：不出現在圖層清單、預設顯示在地圖上，
    // 下游不必把它列進 layersHiddenFromUI / layersShowOnMapByDefault。
    jsdcLayers.forEach((jsdcLayer) =>
      layerController.add(jsdcLayer, {
        hidden:
          jsdcLayer === dgw.sceneLayer ||
          layersHiddenFromUI.includes(jsdcLayer.description.name),
      }),
    )
    // showByNames 會把沒列到的圖層全部隱藏，景點圖層要一起列進去
    layerController.showByNames(
      [...layersShowOnMapByDefault, SCENE_LAYER_NAME],
      true,
    )
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
