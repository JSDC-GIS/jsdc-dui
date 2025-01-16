import React from 'react'
import { IActivableProps } from './types'
import {
  inactiveColor,
  activeColor,
  activeAccentColor,
} from './common/ActivableColor'

const Hamburger = ({ active }: IActivableProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 0 32 32"
      width="32"
    >
      <rect
        style={{ fill: active ? activeAccentColor : inactiveColor }}
        height="4.676"
        rx="1"
        width="6.588"
        x=".8"
        y="5.03"
      />
      <rect
        style={{ fill: active ? activeColor : inactiveColor }}
        height="4.676"
        rx="1"
        width="21.79"
        x="9.41"
        y="5.03"
      />
      <rect
        style={{ fill: active ? activeAccentColor : inactiveColor }}
        height="4.676"
        rx="1"
        width="6.588"
        x=".8"
        y="13.662"
      />
      <rect
        style={{ fill: active ? activeColor : inactiveColor }}
        height="4.676"
        rx="1"
        width="21.79"
        x="9.41"
        y="13.662"
      />
      <rect
        style={{ fill: active ? activeAccentColor : inactiveColor }}
        height="4.676"
        rx="1"
        width="6.588"
        x=".8"
        y="22.293"
      />
      <rect
        style={{ fill: active ? activeColor : inactiveColor }}
        height="4.676"
        rx="1"
        width="21.79"
        x="9.41"
        y="22.293"
      />
      <path d="m0 0h32v32h-32z" fill="none" />
    </svg>
  )
}

export default Hamburger
