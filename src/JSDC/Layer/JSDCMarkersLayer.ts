import { LayerGroup, Marker } from "leaflet";
import JSDCLayer, { JSDCLayerConstructorOptions } from "./JSDCLayer";

class JSDCMarkersLayer extends JSDCLayer<LayerGroup<Marker>> {
  constructor(options: JSDCLayerConstructorOptions) {
    super(options);
    this.instance = new LayerGroup();
  }

  addMarker(marker: Marker) {
    this.instance?.addLayer(marker);
  }

  getLatLngs() {
    const markers = this.instance?.getLayers() as Marker[];
    return markers.map((marker) => marker.getLatLng());
  }
}

export default JSDCMarkersLayer;
