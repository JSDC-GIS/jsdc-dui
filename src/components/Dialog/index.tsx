import React from 'react'
import './index.scss'

export interface IDialogProps {
  onClose: () => void
  title?: string
  open: boolean
}

const Dialog: React.FC<IDialogProps> = ({
  open,
  title,
  onClose,
  children
}) => {
  return (
    <div className={`dui-Dialog ${open ? 'open' : ''}`}>
      <div className="dui-Dialog-header">
        <div className="dui-Dialog-title">{title}</div>
        <div className="close-btn" onClick={() => onClose()}>✕</div>
      </div>
      <div className="dui-Dialog-content">
        {children}
      </div>
    </div>
  )
}

export default Dialog
