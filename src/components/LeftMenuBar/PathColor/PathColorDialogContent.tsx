import React from 'react'
import { PathColorItem } from '../../../JSDC/Dguidewalks/mapLayers'
import './PathColorDialogContent.scss'

export interface IPathColorDialogContentProps {
  items: PathColorItem[]
}

const PathColorDialogContent: React.FC<IPathColorDialogContentProps> = ({
  items,
}: IPathColorDialogContentProps) => {
  return (
    <ul className="dui-PathColorDialogContent">
      {items.map((item) => (
        <li key={`${item.name}_${item.color}`} className="path-item">
          <span
            className="path-color"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          ></span>
          <span className="path-name">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
PathColorDialogContent.displayName = 'PathColorDialogContent'
export default PathColorDialogContent
