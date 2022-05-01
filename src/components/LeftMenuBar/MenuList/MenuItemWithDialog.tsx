import React from 'react'
import { IActiveableProps } from '../../Icons/types'
import MenuDialog from './MenuDialog'
import './MenuItemWithDialog.scss'

export interface IMenuItemWithDialogProps {
  onClick?: () => void
  onActiveChange?: (val?: boolean) => void
  onClose?: () => void
  Icon: ({ active }: IActiveableProps) => JSX.Element
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
          {/* {Icon && <img className="icon"  alt='source not found' src={active ? startIconSrcActive : startIconSrc} />} */}
          <Icon active={active}/>
          <div className="text">{title}</div>
      </div>
      {/* <div className='dialog-container' style={{ display: active ? 'block' : 'none' }}><MenuDialog imgSrc={startIconSrcActive} title={title} onClose={handleClose}>{children}</MenuDialog></div> */}
      <div className='dialog-container' style={{ display: active ? 'block' : 'none' }}><MenuDialog Icon={Icon} title={title} onClose={handleClose}>{children}</MenuDialog></div>
    </div>
  )
}

export default MenuItemWithDialog
