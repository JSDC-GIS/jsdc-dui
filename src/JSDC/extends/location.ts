import JSDC from "../"
import { Control, DomUtil, Icon, latLng, Map, Marker } from "leaflet"

export type Options = {
  position: string,
  Jsdc?: JSDC
}

export type OnAdd = (map: Map) => HTMLDivElement

const iconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAiRJREFUOE+tVNt100AQndGRzGecCmI6CBWgHLSy/wgVECqIUkFMBZgKSCqIP22tcrKpIKECRAfOr2RrmBFaRdYD/6AvP2av7tzHIhx4ZjN/UuzcJwS8XWsdHZrHQwOzIPDJwQcieIy19g/NDwKG4YdzAPzMzE4ZZFICERlCMFm2/W6M2fSBdwB93x+/8dw7QBxkQ0QbArzSWt+0QfcABWzkub8QccyHXgBh4Tjbm9XKpHKwZE1OhAjv5XtB8KUNugcYKmVkmAB+ZlnuD601DYIIHPxWgb5j0GfLtAaUtyM4d8Isy7cTASsZj9xLJOD1MUWi21WSGDk8VWrBG1yKrmudnHUAp2Gw5EMfCehrHCfzv+t7D8xYTKkfu2YlT8ryHKGTv7WyoORst/NOEGgp2tk/awYt1cWQWCfHJcuKBBBEBcAzr/6IoQo28hZ7bh3rUgarZ280CjqT1cMwmHOsrhv0r1CYsAmn1jkLWL+9B7GzBdFvjlHKONGrKbXDxac4vl/ahrTxmo2ZqiDlvJ5gxVhma8A6Cg3XlFIXrO3CSiJgWZ6fSwJeK0kvrOm443LTtXZg5TC429Q6WbZp5D0xyMSmogMoPwgjB+GHfObBeV9nK2Yyw2DdAnS6vAfKEWFRJMjShDEQ+jaXQ23qvW2ERYE4t843jbEdZ/aLvmr+8z4sL9fCZWM4axwNruCFrV5fPvdcHhr4bxds8wUSKZbANG+VIQJ/AEtQSWLBVCyaAAAAAElFTkSuQmCC'
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
