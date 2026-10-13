import { getLegend, LegendName } from '../../../icon'
import { map } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './LegendDialogContent.scss'

export interface ILegendDialogContentProps {
  /**
   * 要用彩色版的類別名稱（中文，不受語系影響），其餘畫灰色版；不在圖例裡的名稱會被忽略。
   * undefined 表示還不確定（資料載入中），這時先不畫任何圖示。
   */
  activeLegends?: Array<LegendName>
}

const LegendDialogContent: React.FC<ILegendDialogContentProps> = ({
  activeLegends,
}: ILegendDialogContentProps) => {
  const { i18n } = useTranslation()
  const legend = getLegend(i18n.language)
  return (
    <div className="dui-LegendDialogContent">
      {activeLegends &&
        map(legend, (value, iconName: LegendName) => (
          <div key={iconName} className="legend-item">
            <img
              className="icon"
              src={
                activeLegends.includes(iconName) ? value.active : value.default
              }
              alt="missing"
            />
          </div>
        ))}
    </div>
  )
}
LegendDialogContent.displayName = 'LegendDialogContent'
export default LegendDialogContent
