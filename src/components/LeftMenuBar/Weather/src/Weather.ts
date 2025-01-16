import { get } from "lodash";

type Dict = { [k: string]: any };

class WeatherElement {
  catch: Dict;
  data: Array<Dict>;
  constructor(jsonObj: Dict) {
    this.catch = jsonObj;
    this.data = jsonObj.time;
  }
  getElements() {
    return this.data.map((item) => {
      let value = get(item, "elementValue[1].value");
      return {
        time: item.startTime,
        description: get(item, "elementValue[0].value"),
        unit: get(item, "elementValue[0].measures"),
        value,
      };
    });
  }
}

class Weather {
  name: string;
  catch: Dict;
  data: Dict;
  constructor(name: string, json_resp: Dict) {
    this.name = name;
    this.catch = json_resp;
    this.data = get(json_resp, "records.locations[0]");
  }
  get description() {
    return get(this.data, "datasetDescription");
  }
  get locationName() {
    return get(this.data, "location[0].locationName");
  }
  get location() {
    return {
      lat: get(this.data, "location[0].lat"),
      lon: get(this.data, "location[0].lon"),
    };
  }
  get elements() {
    return get(this.data, "location[0].weatherElement") as Array<Dict>;
  }
  get wx() {
    return new WeatherElement(
      this.elements.find((elem) => elem.elementName === "Wx")!,
    );
  }
  get temp() {
    return new WeatherElement(
      this.elements.find((elem) => elem.elementName === "T")!,
    );
  }
  get ci() {
    return new WeatherElement(
      this.elements.find((elem) => elem.elementName === "CI")!,
    );
  }
}

export { Weather as default, WeatherElement };
