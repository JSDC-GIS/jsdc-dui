declare type Dict = {
    [k: string]: any;
};
declare class WeatherElement {
    catch: Dict;
    data: Array<Dict>;
    constructor(jsonObj: Dict);
    getElements(): {
        time: any;
        description: any;
        unit: any;
        value: any;
    }[];
}
declare class Weather {
    name: string;
    catch: Dict;
    data: Dict;
    constructor(name: string, json_resp: Dict);
    get description(): any;
    get locationName(): any;
    get location(): {
        lat: any;
        lon: any;
    };
    get elements(): Dict[];
    get wx(): WeatherElement;
    get temp(): WeatherElement;
    get ci(): WeatherElement;
}
export { Weather as default, WeatherElement };
