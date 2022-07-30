import classNames from 'classnames'
import React from 'react'
import './index.scss'

export interface IResponsiveDialogProps {
  Icon?: React.ReactNode
  title?: string
  open: boolean
  children: React.ReactNode
  kanbanImgSrc?: string
  onClose: () => void
  disabledFixedPosition?: boolean
  keepAlive?: boolean
}

const ResponsiveDialog: React.FC<IResponsiveDialogProps> = ({
  Icon,
  title,
  open,
  children,
  kanbanImgSrc,
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
      {kanbanImgSrc && <div className='dui-ResponsiveDialog-kanban'><img src={kanbanImgSrc} alt={title} /></div>}
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
ResponsiveDialog.displayName = 'ResponsiveDialog'
export default ResponsiveDialog
