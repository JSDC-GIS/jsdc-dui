import { LayerGroup, Polyline } from "leaflet";
import JSDCLayer, { JSDCLayerConstructorOptions } from "./JSDCLayer";

class JSDCPolylinesLayer extends JSDCLayer<LayerGroup<Polyline>> {
  constructor(options: JSDCLayerConstructorOptions) {
    super(options);
    this.instance = new LayerGroup();
  }

  addPolyline(polyline: Polyline) {
    this.instance?.addLayer(polyline);
  }
}

export default JSDCPolylinesLayer;
