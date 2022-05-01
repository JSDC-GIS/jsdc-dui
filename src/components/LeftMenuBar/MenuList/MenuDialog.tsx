import React from 'react'
import { IActiveableProps } from '../../Icons/types'
import './MenuDialog.scss'

export interface IMenuDialogProps {
  Icon: ({ active }: IActiveableProps) => JSX.Element
  title: string
  children: React.ReactNode
  onClose: () => void
}

const MenuDialog = ({
  Icon,
  title,
  children,
  onClose = () => null
}: IMenuDialogProps) => {
  return (
    <div className="dui-MenuDialog">
        <div className="header">
            <div className="title">
                {/* <img className="icon" v-if="icon" src={imgSrc} alt='source not found'/> */}
                <div className="icon"><Icon active={true}/></div>
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
