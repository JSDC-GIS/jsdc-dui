import React from 'react'
import './WeatherCard.scss'
import { baseUrl } from '../../../icon'

export interface IWeatherCardProps {
  title: string
  img: string
  degree: string
  description: string
  infoList: any[]
  imgNum: string
}

const WeatherCard = (props: IWeatherCardProps) => {
  return (
    <div className='rui-WeatherCard'>
      <div className='time'>{props.title}</div>
      <div className='description'>
        <p>{props.description}</p>
        {
          props.infoList.map((item, index) => (
            <p key={index}>{item}</p>
          ))
        }
      </div>
      <div className='main-info'>
        <div className="degree">{props.degree}°C</div>
        <img src={`${baseUrl}/weather/value_${props.imgNum}.png`}  alt='source not found' />
      </div>
    </div>
  )
}

export default WeatherCard
