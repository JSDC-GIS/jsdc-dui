import React from 'react';
import './index.scss';
import { LatLng } from 'leaflet';
import useGeolocation from '../../../hooks/useGeolocation';
import { SceneFeature } from '../../../JSDC/Dguidewalks/ApiProvider';
export interface ICheckInCardProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    subtitle: string;
    imgSrc: string;
    mainTextContent: string;
    credit: string;
    sceneLatLng: LatLng;
    /**
     * 這張卡片所屬的景點。有給時導航鈕走 `DuiContext.onSceneNavigate(feature)`（下游可覆寫）；
     * 沒給（單獨使用這個元件）就直接從 `userLatLng` 步行導航到 `sceneLatLng`。
     */
    feature?: SceneFeature;
    innerRef?: React.ForwardedRef<HTMLDivElement>;
    onCheckin?: (src: string) => void;
    userLatLng?: ReturnType<typeof useGeolocation>['latLng'];
    checkinSrc?: string;
    /**
     * 組集章 key 用的點名，與顯示用的 `title` 分開：少數舊點的集章 key 必須沿用
     * GIS 原名（`legacyName`）。沒給時用 `title`。有傳 `checkinSrc` 時不會用到。
     */
    checkinName?: string;
    validDistance?: number;
}
declare const CheckInCard: React.FC<Partial<ICheckInCardProps>>;
export default CheckInCard;
