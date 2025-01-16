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
  return {
    openNavigator: openNewTab,
  }
}

export default useGoogleNavigator
