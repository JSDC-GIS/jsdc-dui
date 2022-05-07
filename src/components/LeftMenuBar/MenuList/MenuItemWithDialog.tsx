import React from 'react'
import { IActivableProps } from '../../Icons/types'
import ResponsiveDialog from '../../ResponsiveDialog'
import MenuDialog from './MenuDialog'
import './MenuItemWithDialog.scss'

export interface IMenuItemWithDialogProps {
  onClick?: () => void
  onActiveChange?: (val?: boolean) => void
  onClose?: () => void
  Icon: ({ active }: IActivableProps) => JSX.Element
  title: string
  children: React.ReactNode
  active?: boolean
}

const MenuItemWithDialog = ({
  onClick = () => null,
  onActiveChange = () => null,
  onClose = () => null,
  Icon,
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
    <div className='dui-MenuItemWithDialog'>
      <div className="list-item" onClick={() => handleClick()}>
          <span className="icon"><Icon active={active}/></span>
          <div className="text">{title}</div>
      </div>
      {/* <div className='dialog-container' style={{ display: active ? 'block' : 'none' }}><MenuDialog Icon={Icon} title={title} onClose={handleClose}>{children}</MenuDialog></div> */}
      <div className='dialog-container' style={{ display: active ? 'block' : 'none' }}><ResponsiveDialog open={true} disabledFixedPosition Icon={<Icon active={active}/>} title={title} onClose={handleClose}>{children}</ResponsiveDialog></div>
    </div>
  )
}

export default MenuItemWithDialog
