import { render } from '@testing-library/react'
import React from 'react'
import {
  DguidewalksContext,
  LayerNames,
} from '../../../JSDC/Dguidewalks/Context'
import LayerDialogContent from './LayerDialogContent'

let mockLanguage = 'zh-TW'
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: mockLanguage } }),
}))

const layerInfos = [
  {
    id: '1',
    type: 'image',
    show: true,
    name: '正射影像',
    nameEn: 'Orthophoto',
  },
  { id: '2', type: 'image', show: false, name: '堡圖' },
  { id: '3', type: 'image', show: false, name: '航照' },
]

const namesOf = (language: string, layerNames: LayerNames = {}) => {
  mockLanguage = language
  const { container } = render(
    <DguidewalksContext.Provider
      value={{ layerLegendImages: {}, layerNames } as any}
    >
      <LayerDialogContent
        layerInfos={layerInfos}
        onToggleShow={() => undefined}
        onOpacityChange={() => undefined}
      />
    </DguidewalksContext.Provider>,
  )
  return Array.from(
    container.querySelectorAll('.dui-LayerItem-content > span'),
  ).map((element) => element.textContent)
}

describe('LayerDialogContent 的圖層名稱', () => {
  it('中文一律顯示 name', () => {
    expect(namesOf('zh-TW', { 堡圖: { en: 'Old Map' } })).toEqual([
      '正射影像',
      '堡圖',
      '航照',
    ])
  })

  it('en 顯示圖磚的 nameEn；沒有 nameEn 的顯示 name', () => {
    expect(namesOf('en')).toEqual(['Orthophoto', '堡圖', '航照'])
  })

  it('nameEn 優先，沒有才看 deprecated 的 layerNames', () => {
    expect(
      namesOf('en', {
        正射影像: { en: 'from layerNames' },
        堡圖: { en: 'Old Map' },
      }),
    ).toEqual(['Orthophoto', 'Old Map', '航照'])
  })
})
