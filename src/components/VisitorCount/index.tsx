import React from 'react'
import { counter } from '../../icon'
import { useTranslation } from 'react-i18next'
import './index.scss'

export interface IVisitorCountProps {
  value: number
}

const VisitorCount = ({ value }: IVisitorCountProps) => {
  const { t } = useTranslation()
  const displayValue = String(value).padStart(10, '0')
  return (
    <div className="dui-VisitorCount">
      <div className="dui-VisitorCount-title">{t('visitorCount.title')}</div>
      <div className="dui-VisitorCount-display">
        {displayValue.split('').map((val, key) => (
          <img key={key} src={counter[val]} alt={String(key)} />
        ))}
      </div>
    </div>
  )
}

export default VisitorCount
