import React from 'react'
import './index.scss'

export interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode,
  type?: "button" | "submit" | "reset" | undefined
}

const Button = (props: IButtonProps) => {
  const {
    children,
    className
  } = props
  return (
    <button {...props} className={`${className} dui-button`}>{children}</button>
  )
}

export default Button
