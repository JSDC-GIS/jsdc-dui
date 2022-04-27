export declare const BASEMAPS: {
    '\u81FA\u7063\u901A\u7528\u96FB\u5B50\u5730\u5716(\u7070\u968E)': string;
    臺灣經建1版地形圖: string;
    石門水利會1965年灌溉區域圖: string;
    '\u6843\u5712\u6C34\u5229\u6703\u704C\u6E89\u5340\u57DF\u5716(1999)': string;
    GoogleMap: string;
    臺灣通用正射影像: string;
    臺灣通用電子地圖: string;
    '\u65E5\u6CBB\u81FA\u7063\u5821\u5716(\u5927\u6B63\u72481921)': string;
    '2001-\u81FA\u7063\u7D93\u5EFA3\u7248\u5730\u5F62\u5716-1:25,000': string;
    '\u5609\u5357\u5927\u5733\u5E73\u5716(1933)': string;
    '\u9B6F\u5730\u5716 Taiwan TOPO': string;
    '1934-\u65E5\u6CBB\u4E09\u5341\u842C\u5206\u4E4B\u4E00\u53F0\u7063\u5168\u5716\t': string;
    '1916-\u65E5\u6CBB\u8543\u5730\u5730\u5F62\u5716': string;
    '1904-\u65E5\u6CBB\u81FA\u7063\u5821\u5716(\u660E\u6CBB\u7248)': string;
    '1897-\u65E5\u6CBB\u81FA\u7063\u5047\u88FD\u4E8C\u5341\u842C\u5206\u4E00\u5716\t': string;
};
export declare type BasemapName = keyof typeof BASEMAPS;
declare class BasemapProvider {
    private _basemaps;
    activeMaps: Array<BasemapName>;
    constructor(activeMaps: Array<BasemapName>);
    listAll(): {
        name: string;
        url: string;
    }[];
}
export default BasemapProvider;
