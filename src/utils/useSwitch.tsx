import React, { useState } from 'react'

type SwitchData = {
  id: string
}

const useSwitch = <T extends SwitchData>(switchDatas: Array<T>) => {
  const [activeData, setactiveData] = useState(switchDatas[0])
  const [activeId, setactiveId] = useState<string | undefined>(undefined)

  const switchById = (id: string | undefined) => {
    if (id === undefined) {
      setactiveId(undefined)
      return
    }
    const target = switchDatas.find((item) => item.id === id)
    if (!target) {
      console.warn(`id: ${id} not found`)
      return
    }
    setactiveData(target)
    setactiveId(id)
  }

  const forceSwitchActiveId = (id: string | undefined) => {
    setactiveId(id)
    switchById(id)
  }

  return {
    switchDatas,
    activeData,
    activeId,
    switchById,
    forceSwitchActiveId,
  }
}

export default useSwitch
