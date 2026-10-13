import JSDC from '../../'
import React, { createContext, useEffect, useState } from 'react'
import Dguidewalks from '..'
import ConfigProvider from '../ConfigProvider'
import { IArticleProxyParser } from '../proxyParser/@types'
import useGeolocation from '../../../hooks/useGeolocation'
import { keepGeoJSONStackOrder, resolveLayerDefaults } from '../mapLayers'

/**
 * 圖層顯示名的語系對照，key 為後端回傳的原始 `name`（同時是各種查找的 key，不做正規化）。
 * 查不到或該語系沒填時，一律 fallback 顯示原始 `name`。
 * @deprecated 英文名稱改讀 `mapConfig` 圖磚的 `nameEn`；這份對照只在圖磚沒有 `nameEn` 時才會用到。
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
  /**
   * @deprecated 是否列在圖層清單改由 `mapConfig` 的 `listed` 決定，不需要再傳。
   * 有傳的話，這些名稱的圖層會「額外」從圖層清單隱藏。
   */
  layersHiddenFromUI?: Array<string>
  /**
   * @deprecated 預設是否顯示改由 `mapConfig` 的 `default`（底圖）、`visible`（線、面）決定，不需要再傳。
   * 有傳的話，這些名稱的圖層會「額外」顯示在地圖上。
   */
  layersShowOnMapByDefault?: Array<string>
  layerNameOrder?: Array<string>
  /** 不傳就用內建的 Strapi 景點文章來源。舊的 Drupal parser 仍可傳入。 */
  articleParser?: IArticleProxyParser
  config: ConfigProvider
  layerLegendImages?: Record<string, string>
  /** @deprecated 英文名稱改讀 `mapConfig` 圖磚的 `nameEn`，`nameEn` 優先，沒有才看這裡。 */
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

  const init = async (isUnmounted: () => boolean) => {
    let stopStackOrder = () => {}
    try {
      const layerController = Jsdc.Controller.get('Layer')
      const jsdcLayers = await dgw.loadMapData()
      if (isUnmounted()) return stopStackOrder
      // 預設是否顯示、是否列在圖層清單以 mapConfig 為準（底圖的 `default`、線面的
      // `visible` / `listed`）；下游還在傳的兩個相容 prop 只會加上去。
      // 景點圖層由 jsdc-dui 管理：不出現在圖層清單、預設顯示在地圖上。
      const defaultsOf = (jsdcLayer: (typeof jsdcLayers)[number]) =>
        jsdcLayer === dgw.sceneLayer
          ? { show: true, hidden: true }
          : resolveLayerDefaults(jsdcLayer.description, {
              layersShowOnMapByDefault,
              layersHiddenFromUI,
            })
      jsdcLayers.forEach((jsdcLayer) =>
        layerController.add(jsdcLayer, {
          hidden: defaultsOf(jsdcLayer).hidden,
        }),
      )
      jsdcLayers.forEach(
        (jsdcLayer) => (jsdcLayer.show = defaultsOf(jsdcLayer).show),
      )
      layerController.setLayerList()
      stopStackOrder = keepGeoJSONStackOrder(jsdcLayers)
    } catch (error) {
      console.error('[map data]: failed to initialize map layers', error)
    } finally {
      // 無論圖層有沒有建成功都要發：景點卡片、深連結、下游的 init 都在等這個事件
      isUnmounted() || dgw.dataLoadEvent.raise()
    }
    return stopStackOrder
  }

  useEffect(() => {
    let unmounted = false
    const ready = init(() => unmounted)
    return () => {
      unmounted = true
      // 解除疊放順序的監聽，provider 重掛時才不會殘留
      ready.then((stopStackOrder) => stopStackOrder())
    }
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
