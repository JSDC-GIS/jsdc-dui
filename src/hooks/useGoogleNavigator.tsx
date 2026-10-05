import React from 'react'

export enum GoogleNavigationType {
  Walk,
  Car,
  MassTransit,
  Bike,
}

export interface GoogleNavigatorOptions {
  origin: [number, number]
  destination: [number, number]
  type: GoogleNavigationType
}

const getNaviType = (type: GoogleNavigationType) => {
  const NaviType = {
    [GoogleNavigationType.Walk]: '!3m1!4b1!4m2!4m1!3e2',
    [GoogleNavigationType.Car]: '!3m1!4b1!4m2!4m1!3e0',
    [GoogleNavigationType.MassTransit]: '!3m1!4b1!4m2!4m1!3e3',
    [GoogleNavigationType.Bike]: '!3m1!4b1!4m2!4m1!3e1',
  }
  return NaviType[type]
}

const useGoogleNavigator = () => {
  const openNewTab = ({
    origin,
    destination,
    type,
  }: GoogleNavigatorOptions) => {
    const url = `https://www.google.com/maps/dir/${origin.join(',')}/${destination.join(',')}/data=${getNaviType(type)}`
    window.open(url)
  }
  // 景點列表、集章卡片的導航鈕共用：從使用者位置步行到目的地，還沒有定位就提示並略過
  const walkTo = (
    origin: { lat: number; lng: number } | undefined,
    destination: { lat: number; lng: number },
  ) => {
    if (!origin) {
      alert('尚未取得GPS位置')
      return
    }
    openNewTab({
      origin: [origin.lat, origin.lng],
      destination: [destination.lat, destination.lng],
      type: GoogleNavigationType.Walk,
    })
  }
  return {
    openNavigator: openNewTab,
    walkTo,
  }
}

export default useGoogleNavigator
