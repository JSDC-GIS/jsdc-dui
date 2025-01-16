import JSDC from "../../";
import React, { createContext, useEffect, useState } from "react";
import Dguidewalks from "..";
import ConfigProvider from "../ConfigProvider";
import { IArticleProxyParser } from "../proxyParser/@types";
import useGeolocation from "../../../hooks/useGeolocation";

export type DguidewalksContextType = {
  dgw: Dguidewalks;
  geolocation: ReturnType<typeof useGeolocation>;
};

const InitialDguidewalksContext = {};

const DguidewalksContext = createContext<DguidewalksContextType>(
  InitialDguidewalksContext as DguidewalksContextType,
);

export interface IDguidewalksProviderProps {
  children: React.ReactNode;
  Jsdc: JSDC;
  layersHiddenFromUI: Array<string>;
  layersShowOnMapByDefault: Array<string>;
  layerNameOrder?: Array<string>;
  articleParser: IArticleProxyParser;
  config: ConfigProvider;
}

const DguidewalksProvider: React.FC<IDguidewalksProviderProps> = ({
  children,
  Jsdc,
  layersHiddenFromUI,
  layersShowOnMapByDefault,
  layerNameOrder = [],
  articleParser,
  config,
}) => {
  const [dgw] = useState(
    new Dguidewalks({
      config,
      layerNameOrder,
      articleParser,
    }),
  );
  const geolocation = useGeolocation();

  const init = async () => {
    const layerController = Jsdc.Controller.get("Layer");
    const jsdcLayers = await dgw.loadGisData();
    jsdcLayers.forEach((jsdcLayer) =>
      layerController.add(jsdcLayer, {
        hidden: layersHiddenFromUI.includes(jsdcLayer.description.name),
      }),
    );
    layerController.showByNames(layersShowOnMapByDefault, true);
    dgw.gisDataLoadEvent.raise();
  };

  useEffect(() => {
    init();
  }, []);

  const value = {
    dgw,
    geolocation,
  };
  return (
    <DguidewalksContext.Provider value={value}>
      {children}
    </DguidewalksContext.Provider>
  );
};
DguidewalksProvider.displayName = "DguidewalksProvider";
export { DguidewalksContext, DguidewalksProvider };
