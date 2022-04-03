import JSDC from "../"
import { CircleMarker, Control, DomUtil, latLng, Map } from "leaflet"

export type Options = {
  position: string,
  Jsdc?: JSDC
}

export type OnAdd = (map: Map) => HTMLDivElement

export default Control.extend<{
  options: Options,
  onAdd: OnAdd
}>({
  options: {
    position: 'topright',
  },
  onAdd: function(map: Map) {
    const container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
    container.innerHTML = '⌖'

    container.style.backgroundColor = 'white'
    container.style.width = '30px'
    container.style.height = '30px'
    container.style.fontWeight = '800'
    container.style.fontSize = '25px'
    container.style.textAlign = 'center'
    container.style.lineHeight = '25px'
    container.style.cursor = 'pointer'

    let marker: CircleMarker | undefined

    navigator.geolocation.watchPosition(({ coords }) => {
      const { latitude, longitude } = coords
      const position = latLng(latitude, longitude)
      if (marker) {
        marker.setLatLng(position)
        return
      }
      marker = new CircleMarker(position)
      marker.addTo(map)
    })

    container.onclick = () => {
      marker && map.flyTo(marker?.getLatLng()!, 17, { duration: 2 })
    }
    return container
  }
})
