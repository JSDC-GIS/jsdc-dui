import React, { useState, useEffect } from 'react'
import Event from '../JSDC/utils/Event'

const useGeolocation = () => {
  const [changeEvent] = useState(new Event<{ lat: number; lng: number }>())
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>()

  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      const result = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      setLatLng(result)
      changeEvent.raise(result)
    })
  }, [])

  return { latLng, changeEvent }
}

export default useGeolocation
