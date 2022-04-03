import icon from '../../../icon'
import { map } from 'lodash'
import React from 'react'
import './LegendDialogContent.scss'

export interface ILegendDialogContentProps {
  activeLegends: Array<keyof typeof icon.legend>
}

const LegendDialogContent = ({
  activeLegends
}: ILegendDialogContentProps) => {
  return (
    <div className="rui-LegendDialogContent">
      {
        map(icon.legend, (value, iconName: keyof typeof icon.legend) => (
          <div key={iconName} className="legend-item">
            <img className="icon" src={activeLegends.includes(iconName) ? value.active : value.default} alt='missing' />
          </div>
        ))
      }
    </div>
  )
}

export default LegendDialogContent
