declare type MenuItemType = {
    id: string;
    name: string;
};
export declare const menuItemKeys: {
    readonly 地圖圖層: "menu.mapLayer";
    readonly 景點介紹: "menu.sceneIntro";
    readonly 氣象預測: "menu.weatherForecast";
    readonly 圖例說明: "menu.legendDescription";
    readonly 路線介紹: "menu.routeIntro";
    readonly 關於圖臺: "menu.aboutPlatform";
};
export declare const useTranslatedMenuItems: (menuItems: MenuItemType[]) => {
    name: any;
    id: string;
}[];
export {};
