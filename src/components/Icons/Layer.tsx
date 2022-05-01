import React from 'react'
import { IActivableProps } from './types'
import { inactiveColor, activeColor, activeAccentColor } from './common/ActivableColor'

const Layer = ({ active }: IActivableProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 32 32" width="32">
      <g transform="translate(122.211 -330.6)">
        <path style={{ fill: active ? activeColor : inactiveColor }} d="m-91.456 346.081-4.174-1.687-2.185.883 3.41 1.379-11.182 4.516a1.676 1.676 0 0 1 -.62.118 1.7 1.7 0 0 1 -.621-.118l-11.188-4.517 3.412-1.378-2.186-.882-4.174 1.686a.649.649 0 0 0 -.446.575.647.647 0 0 0 .446.574l13.226 5.341a4.1 4.1 0 0 0 1.529.291 4.094 4.094 0 0 0 1.528-.291l13.224-5.341a.646.646 0 0 0 .446-.574.648.648 0 0 0 -.445-.575z"/>
        <path style={{ fill: active ? activeColor : inactiveColor }} d="m-91.456 352.259-4.174-1.687-2.185.883 3.41 1.379-11.182 4.516a1.676 1.676 0 0 1 -.62.118 1.7 1.7 0 0 1 -.621-.118l-11.188-4.517 3.412-1.378-2.186-.882-4.174 1.686a.649.649 0 0 0 -.446.575.647.647 0 0 0 .446.574l13.226 5.341a4.1 4.1 0 0 0 1.529.291 4.094 4.094 0 0 0 1.528-.291l13.224-5.341a.646.646 0 0 0 .446-.574.648.648 0 0 0 -.445-.575z"/>
        <path style={{ fill: active ? activeAccentColor : inactiveColor }} d="m-120.964 340.943 13.226 5.341a4.115 4.115 0 0 0 1.529.291 4.114 4.114 0 0 0 1.528-.291l13.225-5.341a.646.646 0 0 0 .446-.574.648.648 0 0 0 -.446-.576l-13.224-5.342a4.1 4.1 0 0 0 -1.53-.291 4.1 4.1 0 0 0 -1.528.29l-13.226 5.343a.649.649 0 0 0 -.446.575.649.649 0 0 0 .446.575z"/>
      </g>
      <path d="m0 0h32v32h-32z" fill="none"/>
    </svg>
  )
}

export default Layer
