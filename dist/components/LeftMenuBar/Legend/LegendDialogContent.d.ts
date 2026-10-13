import { LegendName } from '../../../icon';
import React from 'react';
import './LegendDialogContent.scss';
export interface ILegendDialogContentProps {
    /**
     * 要用彩色版的類別名稱（中文，不受語系影響），其餘畫灰色版；不在圖例裡的名稱會被忽略。
     * undefined 表示還不確定（資料載入中），這時先不畫任何圖示。
     */
    activeLegends?: Array<LegendName>;
}
declare const LegendDialogContent: React.FC<ILegendDialogContentProps>;
export default LegendDialogContent;
