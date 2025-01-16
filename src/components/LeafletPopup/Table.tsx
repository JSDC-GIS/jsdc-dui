import { map } from 'lodash'
import React from 'react'
import './index.scss'

export interface ILeafletPopupTableProps {
  name: string
  value: { [k: string]: string | number }
}

const LeafletPopupTable: React.FC<ILeafletPopupTableProps> = ({
  name,
  value,
}) => {
  const isUrl = (value: string) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
    const regex = new RegExp(expression)
    return regex.test(value)
  }
  return (
    <div className="dui-LeafletPopupTable">
      <div className="dui-LeafletPopupTable-name">{name}</div>
      <div className="dui-LeafletPopupTable-body">
        {map(value, (value, key) => (
          <div key={key} className="row">
            <p>{key}</p>
            {isUrl(String(value)) ? (
              <a target="_blank" href={String(value)}>
                {value}
              </a>
            ) : (
              <p>{value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
LeafletPopupTable.displayName = 'LeafletPopupTable'
export default LeafletPopupTable
