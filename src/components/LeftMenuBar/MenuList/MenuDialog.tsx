import React from 'react'
import './MenuDialog.scss'

export interface IMenuDialogProps {
  imgSrc?: string
  title: string
  children: React.ReactNode
  onClose: () => void
}

const MenuDialog = ({
  imgSrc,
  title,
  children,
  onClose = () => null
}: IMenuDialogProps) => {
  return (
    <div className="dui-MenuDialog">
        <div className="header">
            <div className="title">
                <img className="icon" v-if="icon" src={imgSrc} alt='source not found'/>
                <div className="text">{title}</div>
            </div>
            <div className="action">
                <div className="close-btn" onClick={() => onClose()}>✕</div>
            </div>
            
        </div>
        {children}
    </div>
  )
}

export default MenuDialog
