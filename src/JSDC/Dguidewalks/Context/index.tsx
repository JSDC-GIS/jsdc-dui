import JSDC from "../../";
import React, { createContext, useEffect, useState } from "react";
import Dguidewalks from "..";
import BasemapProvider, { BasemapName } from "../BasemapProvider";
import ConfigProvider from "../ConfigProvider";

export type DguidewalksContextType = {
  dgw: Dguidewalks
}

const InitialDguidewalksContext = {
  dgw: new Dguidewalks({
    config: new ConfigProvider({ eventId: 'initialId' }),
    basemap: new BasemapProvider([])
  })
}

const DguidewalksContext = createContext<DguidewalksContextType>(InitialDguidewalksContext)

export interface IDguidewalksProviderProps {
  Jsdc: JSDC,
  activeBasemaps: Array<BasemapName>,
  layersHiddenFromUI: Array<string>,
  layersShowOnMapByDefault: Array<string>
}

const DguidewalksProvider: React.FC<IDguidewalksProviderProps> = ({
  children,
  Jsdc,
  activeBasemaps,
  layersHiddenFromUI,
  layersShowOnMapByDefault
}) => {
  const [dgw] = useState(new Dguidewalks({
    config: new ConfigProvider({ eventId: Jsdc.id }),
    basemap: new BasemapProvider(activeBasemaps)
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
