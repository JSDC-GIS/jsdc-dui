import { Map } from 'leaflet';
export declare const trackMapMotion: (map: Map) => void;
/** 沒有追蹤過的地圖一律當成靜止。 */
export declare const isMapMoving: (map: Map) => boolean;
/**
 * 地圖靜止時立刻執行 callback；移動中就等這次移動的 moveend。
 * moveend 的 handler 依註冊順序執行，這裡註冊得比較晚，執行時其他圖層
 * （例如 markercluster）已經處理完這次的 zoomend／moveend。
 */
export declare const runWhenMapIdle: (map: Map, callback: () => void) => void;
