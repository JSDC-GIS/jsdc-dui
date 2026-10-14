import React from 'react'
import { render } from '@testing-library/react'
import SceneCheckin from '.'
import { DuiContext } from '../Context'
import { DguidewalksContext } from '../../JSDC/Dguidewalks/Context'
import useCluster from '../../JSDC/hooks/layerVisualization/useCluster'

// 這個測試只看 cluster 參數；Context、對話框、卡片會連到 chroma-js（ESM，jest 不轉譯），換成空殼
jest.mock('../Context', () => ({
  DuiContext: jest.requireActual('react').createContext({}),
}))
jest.mock('../ResponsiveDialog', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('../LeafletPopup/CheckInCard', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('../../JSDC/hooks/layerVisualization/useCluster', () => ({
  __esModule: true,
  default: jest.fn(() => ({ show: true, addLayer: jest.fn() })),
}))

const mockedUseCluster = useCluster as jest.MockedFunction<typeof useCluster>

const renderWithCluster = (cluster: unknown) => {
  const scene = {
    config: { cluster },
    checkinSrc: undefined,
    marker: undefined,
    closeCheckin: jest.fn(),
    closeSceneCard: jest.fn(),
    cardProps: {},
  }
  const dgw = {
    sceneLayer: undefined,
    dataLoadEvent: { addEventListener: () => () => {} },
  }
  return render(
    <DuiContext.Provider value={{ scene } as any}>
      <DguidewalksContext.Provider
        value={{ dgw, geolocation: { latLng: undefined } } as any}
      >
        <SceneCheckin />
      </DguidewalksContext.Provider>
    </DuiContext.Provider>
  )
}

describe('SceneCheckin 的 cluster 設定', () => {
  // react-scripts 的 jest 設定 resetMocks: true，每個測試前會清掉實作，所以在這裡重設
  beforeEach(() =>
    mockedUseCluster.mockImplementation(
      () => ({ show: true, addLayer: jest.fn(), toggleShowCluster: jest.fn() } as any)
    )
  )

  it('預設開 cluster，只用預設參數', () => {
    renderWithCluster(undefined)
    expect(mockedUseCluster).toHaveBeenCalled()
    expect(mockedUseCluster.mock.calls[0][1]).toEqual({
      config: { showCoverageOnHover: false },
    })
  })

  it('cluster: false 不建立 cluster', () => {
    renderWithCluster(false)
    expect(mockedUseCluster).not.toHaveBeenCalled()
  })

  it('傳 MarkerClusterGroupOptions 會和預設參數合併', () => {
    renderWithCluster({ disableClusteringAtZoom: 19, spiderfyOnMaxZoom: false })
    expect(mockedUseCluster.mock.calls[0][1]).toEqual({
      config: {
        showCoverageOnHover: false,
        disableClusteringAtZoom: 19,
        spiderfyOnMaxZoom: false,
      },
    })
  })

  it('參數裡的 showCoverageOnHover 可以覆蓋預設值', () => {
    renderWithCluster({ showCoverageOnHover: true })
    expect(mockedUseCluster.mock.calls[0][1]).toEqual({
      config: { showCoverageOnHover: true },
    })
  })
})
