import React from 'react'
import { IActivableProps } from './types'
import { inactiveColor, activeColor } from './common/ActivableColor'

const Setting = ({ active }: IActivableProps) => {
  const fill = active ? activeColor : inactiveColor
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path
        style={{ fill }}
        d="M4.06,29.7a1.014,1.014,0,0,1-1.015-1.015V3.312a1.015,1.015,0,0,1,2.03,0V28.687A1.014,1.014,0,0,1,4.06,29.7"
      />
      <path
        style={{ fill: active ? activeColor : inactiveColor }}
        d="M8.12,19.9a4.06,4.06,0,1,1-4.06-4.06A4.06,4.06,0,0,1,8.12,19.9"
      />
      <path
        style={{ fill }}
        d="M16,29.7a1.014,1.014,0,0,1-1.015-1.015V3.313a1.015,1.015,0,1,1,2.03,0V28.688A1.014,1.014,0,0,1,16,29.7"
      />
      <path
        style={{ fill: active ? activeColor : inactiveColor }}
        d="M20.06,10.335A4.06,4.06,0,1,1,16,6.275a4.06,4.06,0,0,1,4.06,4.06"
      />
      <path
        style={{ fill }}
        d="M27.94,29.7a1.014,1.014,0,0,1-1.015-1.015V3.312a1.015,1.015,0,0,1,2.03,0V28.687A1.014,1.014,0,0,1,27.94,29.7"
      />
      <path
        style={{ fill: active ? activeColor : inactiveColor }}
        d="M32,19.9a4.06,4.06,0,1,1-4.06-4.06A4.06,4.06,0,0,1,32,19.9"
      />
    </svg>
  )
}

export default Setting
