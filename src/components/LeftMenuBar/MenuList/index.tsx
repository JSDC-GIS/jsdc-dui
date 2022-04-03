import React from 'react'
import useCssVariable from '../../../utils/useCssVariable'
import './index.scss'

export interface IMenuListProps {
  title?: string
  subtitle?: string
  headerImg?: string
  headerMBImg?: string
  children?: React.ReactNode
  endChildren?: React.ReactNode
}

const MenuList = ({
  title,
  subtitle,
  headerImg,
  headerMBImg,
  children,
  endChildren
}: IMenuListProps) => {
  const style = useCssVariable({
    "--header-img": `url(${headerImg})`,
    "--header-mb-img": `url(${headerMBImg})`
  })
  return (
    <div className="dui-MenuList" style={style}>
        <div className="header-img"></div>
        <div className="title">
            <div className="main">{title}</div><div className="sub">{subtitle}</div>
        </div>
        <div className="content">
            <div className='main-content'>
              {children}
            </div>
            <div className="end-content">
              {endChildren}
            </div>
        </div>
    </div>
  )
}

export default MenuList
