import React from 'react'
import LayerItem, { ILayerItemProps } from './LayerItem'
import './LayerDialogContent.scss'

export interface ILayerDialogContentProps {
  layerInfos: Omit<ILayerItemProps, 'onToggleShow' | 'onOpacityChange'>[]
  onToggleShow: (id: string, show: boolean) => void
  onOpacityChange: (id: string, value: number) => void
}

const LayerDialogContent: React.FC<ILayerDialogContentProps> = ({
  layerInfos,
  onToggleShow,
  onOpacityChange
}) => {
  return (
    <div className='dui-LayerDialogContent'>
      {
        layerInfos.map(item => (
          <LayerItem key={item.id} {...item} onToggleShow={show => onToggleShow(item.id, show)} onOpacityChange={value => onOpacityChange(item.id, value)}/>
        ))
      }
    </div>
  )
}
LayerDialogContent.displayName = 'LayerDialogContent'
export default LayerDialogContent
