declare const COUNTY_MAP: {
    宜蘭縣: string;
    桃園市: string;
    新竹縣: string;
    苗栗縣: string;
    彰化縣: string;
    南投縣: string;
    雲林縣: string;
    嘉義縣: string;
    屏東縣: string;
    臺東縣: string;
    花蓮縣: string;
    澎湖縣: string;
    基隆縣: string;
    新竹市: string;
    嘉義市: string;
    臺北市: string;
    高雄市: string;
    新北市: string;
    臺中市: string;
    臺南市: string;
    連江市: string;
    連江縣: string;
    金門市: string;
    金門縣: string;
};
export declare type CountyName = keyof typeof COUNTY_MAP;
export declare type GetTwoDaysApiParam = {
    county: CountyName;
};
export declare type GetTwoDaysApiQuery = {
    Authorization: string;
    locationName: string;
};
/**
 * @param {Object} param
 * @param {Object} query
 * @param {Object} option
 * @example
 * param = {
 *  townName: "民雄鄉",
 * }
 * query = {
 *  county: "澎湖縣",
 * }
 * @returns fetch response
 */
export declare const getTwoDays: (county: keyof typeof COUNTY_MAP, town: string, token: string) => Promise<any>;
export {};
