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
    <div className={`rui-Dialog ${open ? 'open' : ''}`}>
      <div className="rui-Dialog-header">
        <div className="rui-Dialog-title">{title}</div>
        <div className="close-btn" onClick={() => onClose()}>✕</div>
      </div>
      <div className="rui-Dialog-content">
        {children}
      </div>
    </div>
  )
}

export default Dialog
