import JSDC from "../";
import { LayerInfo } from "../Controller/LayerController";
import useLayerInfos from "../hooks/useLayerInfos";
import React, { createContext } from "react";

export type JSDCContextType = {
  Jsdc: JSDC
  layerInfos: LayerInfo[]
}

const initialJSDCValue: JSDCContextType = {
  Jsdc: new JSDC('init'),
  layerInfos: []
}

const JSDCContext = createContext<JSDCContextType>(initialJSDCValue)

export interface IJSDCProviderProps {
  Jsdc: JSDC
}

const JSDCProvider: React.FC<IJSDCProviderProps> = ({
  Jsdc,
  children
}) => {
  const { layerInfos } = useLayerInfos(Jsdc)

  const value = {
    Jsdc,
    layerInfos
  }
  return (
    <JSDCContext.Provider value={value}>
      {children}
    </JSDCContext.Provider>
  )
}
JSDCProvider.displayName = 'JSDCProvider'
export {
  JSDCContext,
  JSDCProvider
}
