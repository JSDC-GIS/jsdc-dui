import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type MenuItemType = {
  id: string;
  name: string;
};

export const menuItemKeys = {
  '地圖圖層': 'menu.mapLayer',
  '景點介紹': 'menu.sceneIntro',
  '氣象預測': 'menu.weatherForecast',
  '圖例說明': 'menu.legendDescription',
  '路線介紹': 'menu.routeIntro',
  '關於圖臺': 'menu.aboutPlatform',
} as const;

export const useTranslatedMenuItems = (menuItems: MenuItemType[]) => {
  const { t } = useTranslation();

  return useMemo(() => {
    return menuItems.map((item) => ({
      ...item,
      name: menuItemKeys[item.id as keyof typeof menuItemKeys]
        ? t(menuItemKeys[item.id as keyof typeof menuItemKeys])
        : item.name,
    }));
  }, [menuItems, t]);
};
