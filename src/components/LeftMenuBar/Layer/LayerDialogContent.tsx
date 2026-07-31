import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import LayerItem, { ILayerItemProps } from './LayerItem'
import './LayerDialogContent.scss'
import { DguidewalksContext } from '../../../JSDC/Dguidewalks/Context'

export interface ILayerDialogContentProps {
  layerInfos: Omit<ILayerItemProps, 'onToggleShow' | 'onOpacityChange'>[]
  onToggleShow: (id: string, show: boolean) => void
  onOpacityChange: (id: string, value: number) => void
}

const LayerDialogContent: React.FC<ILayerDialogContentProps> = ({
  layerInfos,
  onToggleShow,
  onOpacityChange,
}) => {
  const { layerLegendImages, layerNames } = useContext(DguidewalksContext)
  const { i18n } = useTranslation()

  // item.name 仍是各種查找（legend、hidden、order）的 key，只有顯示用的名稱換語系。
  const displayName = (name: string) =>
    (i18n.language.startsWith('en') && layerNames[name]?.en) || name

  return (
    <div className="dui-LayerDialogContent">
      {layerInfos.map((item) => (
        <LayerItem
          key={item.id}
          {...item}
          name={displayName(item.name)}
          onToggleShow={(show) => onToggleShow(item.id, show)}
          onOpacityChange={(value) => onOpacityChange(item.id, value)}
          legendImageUrl={layerLegendImages[item.name]}
        />
      ))}
    </div>
  )
}
LayerDialogContent.displayName = 'LayerDialogContent'
export default LayerDialogContent
