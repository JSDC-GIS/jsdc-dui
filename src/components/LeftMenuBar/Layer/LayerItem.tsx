import React, { useState } from 'react'
import './LayerItem.scss'

export interface ILayerItemProps {
  id: string
  name: string,
  type: 'vector' | 'image' | string
  show: boolean
  onToggleShow: (show: boolean) => void
  onOpacityChange: (value: number) => void
}

const LayerItem: React.FC<ILayerItemProps> = ({
  name,
  type,
  show,
  onToggleShow,
  onOpacityChange
}) => {
  const [openConfig, setopenConfig] = useState(false)
  const [opacity, setopacity] = useState(0)

  const hangleOpacityChange = (value: number) => {
    setopacity(value)
    onOpacityChange(value)
  }

  const canOpenConfig = () => {
    return openConfig && type === 'image'
  }
  return (
    <div className="dui-LayerItem">
      <input type="checkbox" checked={show} onChange={e => onToggleShow(e.currentTarget.checked)}/>
        <div className="dui-LayerItem-content">
            <span onClick={() => setopenConfig(!openConfig)}>{name}</span>
            <div className={`dui-LayerItem-opacity-config ${canOpenConfig() && 'open'}`}>
                <span>透明度</span>
                <input type="range" min="0" max="100" step="1" value={opacity} onInput={e => hangleOpacityChange(Number(e.currentTarget.value))} />
                <span>{opacity}%</span>
            </div>
        </div>
    </div>
  )
}

export default LayerItem
