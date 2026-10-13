import JSDCLayer from '../..//Layer/JSDCLayer';
export type CreateTileLayerOptions = {
    /** 版權文字，顯示在地圖的 attribution 控制項（只在圖層顯示時出現）。 */
    attribution?: string;
    /** 語系是 en 時圖層清單顯示的名稱。 */
    nameEn?: string;
    /** 預設是否顯示在地圖上（`mapConfig.baseLayers` 的 `default`）。 */
    visible?: boolean;
};
declare const createTileLayer: (name: string, url: string, options?: CreateTileLayerOptions) => JSDCLayer<import("leaflet").Layer>;
export default createTileLayer;
