import JSDC from "../"
import { Control, DomUtil, Icon, latLng, Map, Marker } from "leaflet"

export type Options = {
  position: string,
  Jsdc?: JSDC
}

export type OnAdd = (map: Map) => HTMLDivElement

const iconBase64 = 'data:image/svg+xml;;base64,PHN2ZyBpZD0icG9zaXRpb24taWNvbi0yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOS41IiBoZWlnaHQ9IjE5LjUiIHZpZXdCb3g9IjAgMCAxOS41IDE5LjUiPgogIDxwYXRoIGlkPSJQYXRoXzI2IiBkYXRhLW5hbWU9IlBhdGggMjYiIGQ9Ik0zODIuNzg5LDExMy4wNDlhMy41MzgsMy41MzgsMCwxLDAsMy41MzQsMy41MzhBMy41NDQsMy41NDQsMCwwLDAsMzgyLjc4OSwxMTMuMDQ5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM3My4wNTkgLTEwNi44NDcpIiBmaWxsPSIjNDc0NjQ1Ii8+CiAgPHBhdGggaWQ9IlBhdGhfMjciIGRhdGEtbmFtZT0iUGF0aCAyNyIgZD0iTTM5MS40NDcsMTE1LjUxM2gtMS4wMTNhNy42MTMsNy42MTMsMCwwLDAtNi41OTMtNi42di0uOTk0YTEuMDg0LDEuMDg0LDAsMCwwLTEuMDcyLTEuMDczLDEuMDY4LDEuMDY4LDAsMCwwLTEuMDcyLDEuMDczdjEuMDE0YTcuNjEzLDcuNjEzLDAsMCwwLTYuNTkzLDYuNmgtLjk3M2ExLjAzOSwxLjAzOSwwLDAsMC0xLjA3MiwxLjA1NCwxLjA2OCwxLjA2OCwwLDAsMCwxLjA3MiwxLjA3M2gxLjAxM2E3LjYxMSw3LjYxMSwwLDAsMCw2LjU5Miw2LjZ2MS4wMTNhMS4wODYsMS4wODYsMCwwLDAsMS4wNzMsMS4wNzQsMS4wNjksMS4wNjksMCwwLDAsMS4wNzItMS4wNzRWMTI0LjI2YTcuNjEzLDcuNjEzLDAsMCwwLDYuNTkzLTYuNmgxLjAxMmExLjA4NiwxLjA4NiwwLDAsMCwxLjA3My0xLjA3M0ExLjEzLDEuMTMsMCwwLDAsMzkxLjQ0NywxMTUuNTEzWm0tOC42NTgsNi44MThhNS43NDUsNS43NDUsMCwxLDEsNS43MzktNS43NDRBNS43NDUsNS43NDUsMCwwLDEsMzgyLjc4OSwxMjIuMzMxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM3My4wNTkgLTEwNi44NDcpIiBmaWxsPSIjNDc0NjQ1Ii8+Cjwvc3ZnPgo='
const markerBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAABQFJREFUaENjZBgmgHGY+INh1CODLSZHY2Q0RmgUAqNJi0YBS7axozFCTNBVbz1qJ69ntO3P719fH1+66NgeYHeNGH3kqKFpjPRefHJYQFzCBuSwl3dvTa+y1soix5HE6KGpRyZceX6RV0RUb0h6pGTdTjE+Eal8Tm5ufX4xSQdmVlZukEd+fvv66uv7t6e/fvp44Mv7V4t6gtxfERPSxKqhWoyAPCAurzpPSFrOG2T5908f731+//bk/z9/PoD4jCwsAryCwuacfPxKf3///vru2eONb57eL6SWh6jikcZ950slVTXq/wPd+/bR/YXvXj5uwOXAyg2HtHhFRXKE5RTjgZb/f3jlfGyrp9V6YkMelzqKPQLyhIyWbteHly+OPL97NZjYEAZ5SFpLezMohp5cu1xW72TYTYlnKPIIzBNvnzzeVmaiCE5SGKBqpiRYrC39OTbprjP3twrLyHrdO3vSvtXb+hC5niHbI6AQVTQ2PfX53dvzxfoytigOqJ4TzyCnWswgr64LF//x7RfDy8c3GR7eLGdoS9uOrH7Krbd3mVhYeO5dOKFLbIyie5hsj4BCkl9cwuH26UOKKJZP2LaDQcPIHW/IXjmxkqEkIAKmBhQoKhZWVympa8jyCE6LifEEzPUXDs9kqAjNgHHbjl6bJiKnGJcmy8lDTvIiyyPNhy63SalpVl4/tlccHhug5GTrs4AkR+xdY8zQnXMOpAcWOMBSLKXJxXQuSeaAindSNYDUg5oezMzMfAU6kvpw/TMPXgbmCR2SzLt96QRDrpslTM/Uux9ffXrzck+luVoUSeaQ4hFQA1BAQrKMhYNLhpuPX+XNo/uLUNpOO14AqxESAagACFBih+kCNWm4+AWUgbX/nT8/vj358OJ5F7ElGdExMvPx968srKxcMEtRMmbpFCMG55CzJHoDotxDAu4GUD4RV1bLhJkDatZkKfGLE2Mu0R4BRTsHN7coPT3y4+vX19nK/GJU9QgoafGLS5WzcXDIcPILqICaIhQnrZ/ffzH4K6IkLZDZ3z9+uPPrx48nH18+66R60kIOFVAdwsnLo5GrLqpM7cz+9f270zhbCXiihuikhWwGrGlCi+KX3HYXWR4BNdlVTe3uYyQvCirE9pO3lglJyfpjtBSIySCkFL/o5oEsFpaS9bt1+pASShOle/1KBl3LMLz2o9XqsMrw1cN7y8mpQ0B2kRUjII2wWPn26ePtQm0JAxSHV83yZJBUqAM2HI0Y2DnZwHKgjP3o9jmGR7eyYbU5zBx5baPjbFw8EuTGBkUeAWmu3n4sUMnQbN27p4+2lhor+RCZCuDKkHuV986fCqKkg0V2jMBcA8v4n96+ufj05kU3YpvhoOQkpam5mYtfcOA7VjDPgGJGTsdwCajr+hrYdPny+s0UXGNYIA/wS0pUi8orRf35/fvboyvnYyiJCZgbKI4RmEGgZCIsrTgBVPKAmjLfPr6/9+PL5+vAiu0RSA0HD68OJy+fOjsXtxjIA6DBh7dP7xcQG4OEki3VPILsIV4BsXhOPgEHUMcL1j4DOf7jyxcHvn/6cODzh1cLqeUBqscIthBDHqD7/Ob1JZRmP6EgJlGe6jGCbD9sYAEkhneAgkRHY1NOU4+AGppSGjprQBY/u3ElhNgGIDn+oqlHyHEQuXpGPUJuyNFK32iM0CpkyTV3NEbIDTla6RuNEVqFLLnmDpsYAQDgjExRSFDp7QAAAABJRU5ErkJggg=='
export default Control.extend<{
  options: Options,
  onAdd: OnAdd
}>({
  options: {
    position: 'topright',
  },
  onAdd: function(map: Map) {
    const container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
    container.innerHTML = `<img style="width: -webkit-fill-available;padding: 5px;" src="${iconBase64}"/>`

    container.style.backgroundColor = 'white'
    container.style.width = '30px'
    container.style.height = '30px'
    container.style.fontWeight = '800'
    container.style.fontSize = '25px'
    container.style.textAlign = 'center'
    container.style.lineHeight = '25px'
    container.style.cursor = 'pointer'

    let marker: Marker | undefined

    navigator.geolocation.watchPosition(({ coords }) => {
      const { latitude, longitude } = coords
      const position = latLng(latitude, longitude)
      if (marker) {
        marker.setLatLng(position)
        return
      }
      marker = new Marker(position, { icon: new Icon({ iconUrl: markerBase64, iconSize: [35, 35] }) })
      marker.addTo(map)
    })

    container.onclick = () => {
      marker && map.flyTo(marker?.getLatLng()!, 17, { duration: 2 })
    }
    return container
  }
})
