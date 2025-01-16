import React from 'react'
import { IActivableProps } from './types'
import {
  inactiveColor,
  activeColor,
  activeAccentColor,
} from './common/ActivableColor'

const Info = ({ active }: IActivableProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="32"
      viewBox="0 0 32 32"
      width="32"
    >
      <g transform="translate(122.702 -583.545)">
        <path
          style={{ fill: active ? activeColor : inactiveColor }}
          d="m-91.1 599.545a15.6 15.6 0 0 1 -15.6 15.6 15.6 15.6 0 0 1 -15.6-15.6 15.6 15.6 0 0 1 15.6-15.6 15.617 15.617 0 0 1 15.6 15.6zm-2.08 0a13.52 13.52 0 0 0 -13.52-13.52 13.52 13.52 0 0 0 -13.52 13.52 13.52 13.52 0 0 0 13.52 13.52 13.535 13.535 0 0 0 13.518-13.52z"
        />
        <g style={{ fill: active ? activeAccentColor : inactiveColor }}>
          <path d="m-103.459 592.686a1.443 1.443 0 0 1 -1.444 1.444 1.443 1.443 0 0 1 -1.443-1.444 1.443 1.443 0 0 1 1.443-1.443 1.443 1.443 0 0 1 1.444 1.443z" />
          <path d="m-106.722 604.364 1.993-7.437c.369-1.376-1.744-1.944-3.11-1.283a5.3 5.3 0 0 0 -2.106 1.837c.859-.377 2.776-1.23 2.079 1.371l-1.993 7.437c-.369 1.376 1.744 1.944 3.11 1.283a5.3 5.3 0 0 0 2.106-1.837c-.857.377-2.776 1.23-2.079-1.371z" />
        </g>
      </g>
      <path d="m0 0h32v32h-32z" fill="none" />
    </svg>
  )
}

export default Info
