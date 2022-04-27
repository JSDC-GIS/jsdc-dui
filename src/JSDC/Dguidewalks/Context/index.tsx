import JSDC from "../../";
import React, { createContext, useEffect, useState } from "react";
import Dguidewalks from "..";
import ConfigProvider from "../ConfigProvider";

export type DguidewalksContextType = {
  dgw: Dguidewalks
}

const InitialDguidewalksContext = {
  // dgw: new Dguidewalks({
  //   config: new ConfigProvider({ eventId: 'initialId' }),
  //   basemap: new BasemapProvider([])
  // })
}

const DguidewalksContext = createContext<DguidewalksContextType>(InitialDguidewalksContext as DguidewalksContextType)

export interface IDguidewalksProviderProps {
  Jsdc: JSDC,
  layersHiddenFromUI: Array<string>,
  layersShowOnMapByDefault: Array<string>
  baseApiUrl?: string
}

const DguidewalksProvider: React.FC<IDguidewalksProviderProps> = ({
  children,
  Jsdc,
  layersHiddenFromUI,
  layersShowOnMapByDefault,
  baseApiUrl
}) => {
  const [dgw] = useState(new Dguidewalks({
    config: new ConfigProvider({ eventId: Jsdc.id, baseApiUrl })
  }))
  const init = async () => {
    const layerController = Jsdc.Controller.get('Layer')
    const jsdcLayers = await dgw.loadGisData()
    jsdcLayers.forEach(jsdcLayer => layerController.add(jsdcLayer, {
      hidden: layersHiddenFromUI.includes(jsdcLayer.description.name)
    }))
    layerController.showByNames(layersShowOnMapByDefault, true)
    dgw.gisDataLoadEvent.raise()
  }

  useEffect(() => {
    init()
  }, [])

  const value = {
    dgw
  }
  return (
    <DguidewalksContext.Provider value={value}>
      {children}
    </DguidewalksContext.Provider>
  )
}

export {
  DguidewalksContext,
  DguidewalksProvider
}
