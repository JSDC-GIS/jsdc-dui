import ViewerPromise from "./module/ViewerPromise";
import Leaflet, { LatLng, LatLngBounds, Map } from 'leaflet'
import { defaults } from "lodash";
import Controller from "./Controller";
import location from "./extends/location";
import zoomHome from "./extends/zoomHome";
import { iconUrl, iconRetinaUrl, shadowUrl } from "./utils/markerImages";
import Event from "./utils/Event";

const iconDefault = Leaflet.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  Leaflet.Marker.prototype.options.icon = iconDefault;

class JSDC
{
    id: string
    viewer: Map | undefined
    viewerPromise = new ViewerPromise()
    Controller = new Controller('JSDCController')
    mapOption: Leaflet.MapOptions & { bound?: LatLngBounds }
    userGeolocationUpdateEvent = new Event<LatLng>()
    constructor (id: string, mapOption: Leaflet.MapOptions & { bound?: LatLngBounds } = {}) {
        this.id = id
        this.viewer = undefined
        this.mapOption = mapOption
    }
    get asyncViewer () {
        return this.viewerPromise.asyncViewer
    }
    createViewer(option = this.mapOption) {
        const _option = defaults(option, {
            center: [24.86471, 121.29002],
            zoom: 13
        })
        try {
            this.viewer = new Map( this.id, _option)
            option.bound && this.viewer.flyToBounds(option.bound)
            this.viewer.zoomControl.setPosition('topright')
            this.viewer.addControl(new location({ Jsdc: this } as any))
            this.viewer.addControl(new zoomHome({ Jsdc: this } as any))
            this.Controller.init(this.viewer)
            this.viewerPromise.setViewer(this.viewer)
        } catch (error) {
            console.log('ignore Map initialize')
        }
        return this.viewer
    }
}

export default JSDC
