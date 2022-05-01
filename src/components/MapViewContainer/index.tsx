import MapView, { IMapViewProps } from '../MapView'
import React from 'react'
import useCssVariable from '../../utils/useCssVariable'
import './index.scss'

export interface IMapViewContainerProps {
  headerImgSrc?: string
  menuChildren?: React.ReactNode
  mapChildren?: React.ReactNode
  Jsdc: IMapViewProps['Jsdc']
}

const credit = `版權所有 Ⓒ ${new Date().getFullYear()}\n 平台內容維護｜智紳數位文化事業有限公司/Design by SomeDesige.`

const MapViewContainer = ({
  headerImgSrc,
  menuChildren,
  mapChildren,
  Jsdc
}: IMapViewContainerProps) => {
  const style = useCssVariable({
    "--header-mb-img": `url(${headerImgSrc})`
  })
  return (
    <div className="dui-MapViewContainer" style={style}>
      <div className="header-img-mb"></div>
      <div className="pd-space">
          <p className="credit">{credit}</p>
          {menuChildren}
          <div className="map">
            <MapView Jsdc={Jsdc}/>
            {mapChildren}
          </div>
      </div>
  </div>
  )
}

export default MapViewContainer
