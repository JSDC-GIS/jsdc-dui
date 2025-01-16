import icon from '../../../icon'
import { map } from 'lodash'
import React from 'react'
import './LegendDialogContent.scss'

export interface ILegendDialogContentProps {
  activeLegends: Array<keyof typeof icon.legend>
}

const LegendDialogContent: React.FC<ILegendDialogContentProps> = ({
  activeLegends,
}: ILegendDialogContentProps) => {
  return (
    <div className="dui-LegendDialogContent">
      {map(icon.legend, (value, iconName: keyof typeof icon.legend) => (
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
