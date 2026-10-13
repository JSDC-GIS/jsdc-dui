import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import LayerItem, { ILayerItemProps } from './LayerItem'
import './LayerDialogContent.scss'
import { DguidewalksContext } from '../../../JSDC/Dguidewalks/Context'

export interface ILayerDialogContentProps {
  layerInfos: (Omit<ILayerItemProps, 'onToggleShow' | 'onOpacityChange'> & {
    /** 圖磚的英文名稱（`mapConfig` 的 `nameEn`），語系是 en 時顯示。 */
    nameEn?: string
  })[]
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
  // 英文以圖磚自己的 nameEn 優先，沒有才看已 deprecated 的 layerNames 對照。
  const displayName = (name: string, nameEn?: string) =>
    (i18n.language.startsWith('en') && (nameEn || layerNames[name]?.en)) || name

  return (
    <div className="dui-LayerDialogContent">
      {layerInfos.map(({ nameEn, ...item }) => (
        <LayerItem
          key={item.id}
          {...item}
          name={displayName(item.name, nameEn)}
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
