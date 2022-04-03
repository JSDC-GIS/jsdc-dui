import icon from '../../../icon'
import React from 'react'
import './CreditDialogContent.scss'

export interface ICreditDialogContentProps {
  description: string
}

const CreditDialogContent = ({
  description
}: ICreditDialogContentProps) => {
  return (
    <div className="rui-CreditDialogContent">
      <div className="rui-CreditDialogContent-content">
          {description}
          <img className="qr-code" src={icon.credit.qrcode} />
      </div>
      <div className="final">
          <img src={icon.credit.logo}  />
      </div>
    </div>
  )
}

export default CreditDialogContent
