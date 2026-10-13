import JSDCLayer from '../Layer/JSDCLayer';
import JSDCGeoJSONLayer from '../Layer/JSDCGeoJSONLayer';
import { WalkGeoJSONLayer } from './ApiProvider';
/** `mapConfig.overlays` 的一筆 `geojson` 疊圖和它建出來的圖層。 */
export type GeoJSONOverlayLayer = {
    overlay: WalkGeoJSONLayer;
    layer: JSDCGeoJSONLayer;
};
/** 「路線顏色」選單的一列。 */
export type PathColorItem = {
    /** 線段名稱原文（`properties[styleBy.prop]`，沒有 `styleBy` 時是 `properties.name`）。 */
    name: string;
    /** 顯示用的名稱：語系是 en 且線段有 `properties.nameEn` 時是 `nameEn`，否則同 `name`。 */
    label: string;
    color: string;
};
/** 設定裡沒有指定顏色時，Leaflet 畫線用的預設色。 */
export declare const DEFAULT_PATH_COLOR = "#3388ff";
/**
 * 由已載入的線圖層產生「路線顏色」清單，每個線段一列：
 * - 只列幾何是 LineString / MultiLineString 的 feature，面圖層不列（即使有 `styleBy`）。
 * - 名稱是 `properties[styleBy.prop]`，沒有 `styleBy` 時用 `properties.name`；沒有名稱的不列。
 * - 顏色是 `styleBy.styles[名稱].color`，對不上就用 `style.color`。
 * - 同名同色的合併成一列。
 */
export declare const getPathColorItems: (overlayLayers: GeoJSONOverlayLayer[], language?: string) => PathColorItem[];
export type LayerDefaultsOptions = {
    /** @deprecated 相容用：這些名稱的圖層額外顯示在地圖上。 */
    layersShowOnMapByDefault?: string[];
    /** @deprecated 相容用：這些名稱的圖層額外從圖層清單隱藏。 */
    layersHiddenFromUI?: string[];
};
/**
 * 圖層的預設狀態：以 `mapConfig`（已寫在 `description.visible` / `listed`）為準，
 * 下游還在傳的 `layersShowOnMapByDefault`、`layersHiddenFromUI` 只會「加上去」，
 * 不會把 `mapConfig` 設定要顯示的圖層關掉。
 */
export declare const resolveLayerDefaults: (description: JSDCLayer['description'], { layersShowOnMapByDefault, layersHiddenFromUI, }?: LayerDefaultsOptions) => {
    show: boolean;
    hidden: boolean;
};
/**
 * 維持線、面的疊放順序：面在下、線在上，同一種之間照 `mapConfig.overlays` 的陣列順序
 * （後面的在上）。Leaflet 的向量圖形是「後加到地圖的在上面」，使用者從圖層清單
 * 重新打開圖層就會跑到最上面，所以每次開關都重排一次。回傳解除監聽的函式。
 */
export declare const keepGeoJSONStackOrder: (layers: JSDCLayer[]) => () => void;
/**
 * 圖層清單的顯示順序：`layerNameOrder` 列到的名稱照它的順序排在前面，沒列到的維持原順序
 * 排在後面。穩定排序、不以名稱當 key，所以同名的圖層都會保留（各自一列）。
 */
export declare const sortByLayerNameOrder: <T extends {
    description: {
        name: string;
    };
}>(layerInfos: T[], layerNameOrder?: string[]) => T[];
