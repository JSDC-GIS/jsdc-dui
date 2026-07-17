import { getLegend, LegendName } from '../../../icon'
import { map } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import './LegendDialogContent.scss'

export interface ILegendDialogContentProps {
  activeLegends: Array<LegendName>
}

const LegendDialogContent: React.FC<ILegendDialogContentProps> = ({
  activeLegends,
}: ILegendDialogContentProps) => {
  const { i18n } = useTranslation()
  const legend = getLegend(i18n.language)
  return (
    <div className="dui-LegendDialogContent">
      {map(legend, (value, iconName: LegendName) => (
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
