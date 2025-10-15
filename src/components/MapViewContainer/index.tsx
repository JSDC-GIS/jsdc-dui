import MapView, { IMapViewProps } from '../MapView'
import React from 'react'
import useCssVariable from '../../utils/useCssVariable'
import { useTranslation } from 'react-i18next'
import './index.scss'

export interface IMapViewContainerProps {
  headerImgSrc?: string
  menuChildren?: React.ReactNode
  mapChildren?: React.ReactNode
  Jsdc: IMapViewProps['Jsdc']
}

const MapViewContainer: React.FC<IMapViewContainerProps> = ({
  headerImgSrc,
  menuChildren,
  mapChildren,
  Jsdc,
}: IMapViewContainerProps) => {
  const { t } = useTranslation()
  const style = useCssVariable({
    '--header-mb-img': `url(${headerImgSrc})`,
  })

  const credit = `${t('copyright.text', { year: new Date().getFullYear() })}\n ${t('copyright.maintenance')}<a href="https://somedesign.com.tw" target='_blank'>${t('copyright.design')}</a>.`

  return (
    <div className="dui-MapViewContainer" style={style}>
      <div className="header-img-mb"></div>
      <div className="pd-space">
        <p className="credit" dangerouslySetInnerHTML={{ __html: credit }}></p>
        {menuChildren}
        <div className="map">
          <MapView Jsdc={Jsdc} />
          {mapChildren}
        </div>
      </div>
    </div>
  )
}
MapViewContainer.displayName = 'MapViewContainer'
export default MapViewContainer
