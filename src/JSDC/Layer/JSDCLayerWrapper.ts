import { Layer, Map } from "leaflet";

const JSDCLayerWrapper = (layer: Layer) => {
  const privateViewer = (layer as any)._map as Map | undefined;
  return;
};
