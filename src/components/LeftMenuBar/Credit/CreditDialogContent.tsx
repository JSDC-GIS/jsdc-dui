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
    <div className="dui-CreditDialogContent">
      <div className="dui-CreditDialogContent-content">
          {description}
          <img className="qr-code" src={icon.credit.qrcode} alt='missing' />
      </div>
      <div className="final">
          <img src={icon.credit.logo} alt='missing' />
      </div>
    </div>
  )
}

export default CreditDialogContent
