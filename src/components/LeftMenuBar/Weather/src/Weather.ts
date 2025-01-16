import { get } from 'lodash'

type Dict = { [k: string]: any }

class WeatherElement {
  catch: Dict
  data: Array<Dict>
  constructor(jsonObj: Dict) {
    this.catch = jsonObj
    this.data = jsonObj.Time
  }
  getElements() {
    return this.data.map((item) => {
      return {
        time: item.StartTime,
        description: item.ElementValue[0].Weather,
        temp: item.ElementValue[0].Temperature,
        ci: item.ElementValue[0].ComfortIndexDescription,
        value: item.ElementValue[0].WeatherCode,
      }
    })
  }
}

class Weather {
  name: string
  catch: Dict
  data: Dict
  constructor(name: string, json_resp: Dict) {
    this.name = name
    this.catch = json_resp
    this.data = get(json_resp, 'records.Locations[0]')
  }
  get description() {
    return get(this.data, 'DatasetDescription')
  }
  get locationName() {
    return get(this.data, 'Location[0].LocationName')
  }
  get location() {
    return {
      lat: get(this.data, 'Location[0].Latitude'),
      lon: get(this.data, 'Location[0].Longitude'),
    }
  }
  get elements() {
    return get(this.data, 'Location[0].WeatherElement') as Array<Dict>
  }
  get wx() {
    return new WeatherElement(
      this.elements.find((elem) => elem.ElementName === '天氣現象')!,
    )
  }
  get temp() {
    return new WeatherElement(
      this.elements.find((elem) => elem.ElementName === '溫度')!,
    )
  }
  get ci() {
    return new WeatherElement(
      this.elements.find((elem) => elem.ElementName === '舒適度指數')!,
    )
  }
}

export { Weather as default, WeatherElement }
