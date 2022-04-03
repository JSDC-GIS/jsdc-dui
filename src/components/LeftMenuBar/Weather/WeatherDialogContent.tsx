import { uniqueId } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import WeatherCard from './WeatherCard'
import { CountyName, getTwoDays } from './src/api'
import Weather from './src/Weather'
import "./WeatherDialogContent.scss"

class WeaherLocation {
  county: CountyName
  town: string 
  id: string
  constructor( county: CountyName, town: string )
  {
      this.id = uniqueId()
      this.county = county
      this.town = town
  }
  get fullName() { return `${this.county} ${this.town}` }
}

type WeatherItem = {
  time: any
  description: any
  unit: any
  value: any
  temp: any
  ci: any
  img: any
}

export interface IWeatherDialogContentProps {
  locations: Array<{ county: CountyName, town: string }>,
  token: string
  onSelectLocation?: (latlng: [number, number]) => void
}

const WeatherDialogContent = ({
  locations,
  token,
  onSelectLocation = () => null
}: IWeatherDialogContentProps) => {
  const selectElem = useRef<HTMLDivElement>(null)
  const [loading, setloading] = useState(true)
  const [showOption, setshowOption] = useState(false)
  const [weatherLocations] = useState<Array<WeaherLocation>>(locations.map(item => new WeaherLocation(item.county, item.town)))
  const [activeLocation, setactiveLocation] = useState(weatherLocations[0])
  const [weatherItems, setweatherItems] = useState<WeatherItem[]>([])
  const [locationInfoMap, setlocationInfoMap] = useState<{ [k: string]: WeatherItem[] }>({})
  const [weatherDatas, setweatherDatas] = useState<Array<Weather>>()

  const setInfo = async () => {
    let weathers: Array<Weather> = []
    let map: { [k: string]: WeatherItem[] } = {}
    for( let location of weatherLocations)
    {
        const resp = await getTwoDays(location.county, location.town, token)
        const weather = new Weather(location.id, resp )
        weathers.push(weather)
        const wx = weather.wx.getElements()
        const temp = weather.temp.getElements()
        const ci = weather.ci.getElements()
        map[location.id] = wx.map((item, index) => {
            let result: any = {...item}
            result.temp = temp[index].description
            result.ci = ci[index].value
            return result as WeatherItem
        })
    }
    setlocationInfoMap(map)
    setweatherDatas(weathers)
    setweatherItems(map[activeLocation.id])
    setloading(false)
  }

  const handleLocationSelect = (location: WeaherLocation) => {
    setactiveLocation(location)
    setweatherItems(locationInfoMap[location.id])
    let targetWeather = weatherDatas?.find( weather => weather.name === location.id)
    setshowOption(false)
    if (!targetWeather) return 
    onSelectLocation([targetWeather.location.lat, targetWeather.location.lon])
  }

  useEffect(() => {
    setInfo()
  }, [])
  return (
    <div className="rui-WeatherDialogContent">
        <div className="select" ref={selectElem}>
            <span className="selected" onClick={() => setshowOption(!showOption)}>{activeLocation.fullName}
                <div className="pointer">▼</div>
            </span>
            <div className={`option ${showOption || 'hide'}`}>
              {
                weatherLocations.map(location => (
                  <div key={location.fullName} className="item" onClick={() => handleLocationSelect(location)}>{location.fullName}</div>
                ))
              }
            </div>
            
        </div>
        { loading && <img className="loading" src={require('./processing.gif')}  alt='source not found'/>}
        <div className="weather-card-container">
          {
            weatherItems.map((item, index) => (
              <WeatherCard key={index}
                title={item.time}
                img={item.img}
                degree={item.temp}
                description={item.description}
                infoList={[item.ci]}
                imgNum={item.value}/>
            ))
          }
        </div>
    </div>
  )
}

export default WeatherDialogContent
