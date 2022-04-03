import React from 'react'
import MenuDialog from './MenuDialog'
import './MenuItemWithDialog.scss'

export interface IMenuItemWithDialogProps {
  onClick?: () => void
  onActiveChange?: (val?: boolean) => void
  onClose?: () => void
  startIconSrc?: string
  startIconSrcActive?: string
  title: string
  children: React.ReactNode
  active?: boolean
}

const MenuItemWithDialog = ({
  onClick = () => null,
  onActiveChange = () => null,
  onClose = () => null,
  startIconSrc,
  startIconSrcActive,
  title,
  children,
  active = false
}: IMenuItemWithDialogProps) => {
  const handleClose = () => {
    onActiveChange(false)
    onClose()
  }
  const handleClick = () => {
    onActiveChange(true)
    onClick()
  }
  return (
    <div className='rui-MenuItemWithDialog'>
      <div className="list-item" onClick={() => handleClick()}>
          {startIconSrc && <img className="icon"  alt='source not found' src={active ? startIconSrcActive : startIconSrc} />}
          <div className="text">{title}</div>
      </div>
      {
        <div className='dialog-container' style={{ display: active ? 'block' : 'none' }}><MenuDialog imgSrc={startIconSrcActive} title={title} onClose={handleClose}>{children}</MenuDialog></div>
      }
    </div>
  )
}

export default MenuItemWithDialog
