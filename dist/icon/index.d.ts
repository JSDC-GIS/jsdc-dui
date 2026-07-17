export declare const baseUrl = "https://map.jsdc.com.tw/webgis/dguidewalks/assets/";
export declare const legendFilenames: {
    人文地景: string;
    歷史建物: string;
    聚落: string;
    自然地景: string;
    田園景色: string;
    資訊站: string;
    紀念指標: string;
    展覽場館: string;
    水利工程: string;
    工作站: string;
    裝置藝術: string;
    商店: string;
};
export type LegendName = keyof typeof legendFilenames;
export interface ILegendIcon {
    default: string;
    active: string;
}
export declare const getLegend: (lng?: string) => Record<LegendName, ILegendIcon>;
export declare const legend: Record<"人文地景" | "歷史建物" | "聚落" | "自然地景" | "田園景色" | "資訊站" | "紀念指標" | "展覽場館" | "水利工程" | "工作站" | "裝置藝術" | "商店", ILegendIcon>;
export declare const counter: {
    [k: string]: string;
};
export declare const activable: {
    layer: string;
    layerActive: string;
    weather: string;
    weatherActive: string;
    hamburger: string;
    hamburgerActive: string;
    info: string;
    infoActive: string;
    about: string;
    aboutActive: string;
    locationMappin: string;
    locationMappinActive: string;
};
export declare const credit: {
    qrcode: string;
    logo: string;
};
export declare const others: {
    processing: string;
};
declare const _default: {
    activable: {
        layer: string;
        layerActive: string;
        weather: string;
        weatherActive: string;
        hamburger: string;
        hamburgerActive: string;
        info: string;
        infoActive: string;
        about: string;
        aboutActive: string;
        locationMappin: string;
        locationMappinActive: string;
    };
    legend: Record<"人文地景" | "歷史建物" | "聚落" | "自然地景" | "田園景色" | "資訊站" | "紀念指標" | "展覽場館" | "水利工程" | "工作站" | "裝置藝術" | "商店", ILegendIcon>;
    credit: {
        qrcode: string;
        logo: string;
    };
    others: {
        processing: string;
    };
};
export default _default;
