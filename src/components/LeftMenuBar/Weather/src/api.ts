
const COUNTY_MAP = {
    "宜蘭縣":"F-D0047-001",
    "桃園市":"F-D0047-005",
    "新竹縣":"F-D0047-009",
    "苗栗縣":"F-D0047-013",
    "彰化縣":"F-D0047-017",
    "南投縣":"F-D0047-021",
    "雲林縣":"F-D0047-025",
    "嘉義縣":"F-D0047-029",
    "屏東縣":"F-D0047-033",
    "臺東縣":"F-D0047-037",
    "花蓮縣":"F-D0047-041",
    "澎湖縣":"F-D0047-045",
    "基隆縣":"F-D0047-049",
    "新竹市":"F-D0047-053",
    "嘉義市":"F-D0047-057",
    "臺北市":"F-D0047-061",
    "高雄市":"F-D0047-065",
    "新北市":"F-D0047-069",
    "臺中市":"F-D0047-073",
    "臺南市":"F-D0047-077",
    "連江市":"F-D0047-081",
    "連江縣":"F-D0047-083",
    "金門市":"F-D0047-085",
    "金門縣":"F-D0047-087"
}

export type CountyName = keyof typeof COUNTY_MAP

export type GetTwoDaysApiParam = {
  county: CountyName
}

export type GetTwoDaysApiQuery = {
  Authorization: string,
  locationName: string
}

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
export const getTwoDays = async (county: keyof typeof COUNTY_MAP, town: string, token: string) => 
{
  const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${COUNTY_MAP[county]}/?Authorization=${token}&locationName=${town}`
  const resp = await fetch(url)
  const json = await resp.json()
  return json
}

