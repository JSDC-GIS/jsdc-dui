import classNames from 'classnames'
import React from 'react'
import './index.scss'

export interface IResponsiveDialogProps {
  Icon?: React.ReactNode
  title?: string
  open: boolean
  children: React.ReactNode
  onClose: () => void
  disabledFixedPosition?: boolean
  keepAlive?: boolean
}

const ResponsiveDialog = ({
  Icon,
  title,
  open,
  children,
  disabledFixedPosition = false,
  keepAlive = false,
  onClose = () => null
}: IResponsiveDialogProps) => {
  const displayStyle = keepAlive
    ? open
      ? 'flex'
      : 'none'
    : 'flex'
  
  if (!keepAlive && !open) return null
  return (
    <div style={{ display: displayStyle }} className={classNames('dui-ResponsiveDialog', { 'dui-ResponsiveDialog-disableFixed': disabledFixedPosition })}>
      <div className="header">
          <div className="title">
              {Icon && <div className="icon">{Icon}</div>}
              <div className="text">{title}</div>
          </div>
          <div className="action">
              <div className="close-btn" onClick={() => onClose()}><p>✕</p></div>
          </div>
      </div>
      {children}
    </div>
  )
}

export default ResponsiveDialog
