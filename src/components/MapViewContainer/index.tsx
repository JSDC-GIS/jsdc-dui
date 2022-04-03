import MapView, { IMapViewProps } from '../MapView'
import React from 'react'
import useCssVariable from '../../utils/useCssVariable'
import './index.scss'

export interface IMapViewContainerProps {
  headerImgSrc?: string
  credit?: string
  menuChildren?: React.ReactNode
  mapChildren?: React.ReactNode
  Jsdc: IMapViewProps['Jsdc']
}

const MapViewContainer = ({
  headerImgSrc,
  credit = `版權所有 Ⓒ 2021 平台內容維護｜智紳數位文化事業有限公司/Design by SomeDesige.`,
  menuChildren,
  mapChildren,
  Jsdc
}: IMapViewContainerProps) => {
  const style = useCssVariable({
    "--header-mb-img": `url(${headerImgSrc})`
  })
  return (
    <div className="rui-MapViewContainer" style={style}>
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
