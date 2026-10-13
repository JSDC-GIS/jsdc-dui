import React from 'react'
import { IActivableProps } from './types'
import {
  inactiveColor,
  activeColor,
  activeAccentColor,
} from './common/ActivableColor'

const PathColor = ({ active }: IActivableProps) => {
  // match Hamburger: the route line uses activeColor, its nodes use activeAccentColor
  const lineStroke = active ? activeColor : inactiveColor
  const nodeFill = active ? activeAccentColor : inactiveColor
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <polyline
        style={{
          fill: 'none',
          stroke: lineStroke,
          strokeWidth: 3,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
        points="5,25 12,9 20,21 27,7"
      />
      <circle style={{ fill: nodeFill }} cx="5" cy="25" r="4" />
      <circle style={{ fill: nodeFill }} cx="12" cy="9" r="4" />
      <circle style={{ fill: nodeFill }} cx="20" cy="21" r="4" />
      <circle style={{ fill: nodeFill }} cx="27" cy="7" r="4" />
      <path d="m0 0h32v32h-32z" fill="none" />
    </svg>
  )
}

export default PathColor
