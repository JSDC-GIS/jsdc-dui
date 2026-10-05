import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { DguidewalksContext } from '../../../JSDC/Dguidewalks/Context'
import {
  SceneFeature,
  SceneProperties,
} from '../../../JSDC/Dguidewalks/ApiProvider'
import { SummaryArticleType } from '../../../JSDC/Dguidewalks/proxyParser/@types'
import SceneDialogContent from './SceneDialogContent'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'zh-TW' } }),
}))

const scene = (
  id: string,
  title: string,
  coordinates: [number, number] | null,
): SceneFeature => ({
  type: 'Feature',
  id,
  geometry: coordinates && { type: 'Point', coordinates },
  properties: { title } as SceneProperties,
})

const article = (
  title: string,
  feature?: SceneFeature,
): SummaryArticleType => ({
  id: feature?.id,
  feature,
  title,
  content: '',
  imgSrc: '',
  link: '',
})

const street = scene('doc-street', '01老街', [121.28, 24.88])
const entrance = scene('doc-entrance', '01老街入口', [121.29, 24.89])
const noGeometry = scene('doc-nowhere', '02沒有座標', null)

const setup = async (articles: SummaryArticleType[]) => {
  const onTarget = jest.fn()
  const onNavigate = jest.fn()
  const dgw = { getSceneArticles: jest.fn(async () => articles) }
  const { container } = render(
    <DguidewalksContext.Provider value={{ dgw } as any}>
      <SceneDialogContent onTarget={onTarget} onNavigate={onNavigate} />
    </DguidewalksContext.Provider>,
  )
  await waitFor(() =>
    expect(
      container.querySelectorAll('.dui-SceneDialogContent-row'),
    ).toHaveLength(articles.length),
  )
  const rows = Array.from(
    container.querySelectorAll('.dui-SceneDialogContent-row'),
  )
  return { rows, onTarget, onNavigate }
}

describe('SceneDialogContent', () => {
  it('定位、導航鈕把該列的景點 feature 傳出去，title 互相包含也不會配錯', async () => {
    const { rows, onTarget, onNavigate } = await setup([
      article('01老街', street),
      article('01老街入口', entrance),
    ])
    fireEvent.click(rows[1].querySelector('.header-action')!)
    fireEvent.click(rows[1].querySelector('.geonavigator')!)
    expect(onTarget).toHaveBeenCalledTimes(1)
    expect(onTarget).toHaveBeenCalledWith(entrance)
    expect(onNavigate).toHaveBeenCalledWith(entrance)

    fireEvent.click(rows[0].querySelector('.header-action')!)
    expect(onTarget).toHaveBeenLastCalledWith(street)
  })

  it('沒有座標的景點照樣列出，但沒有定位、導航鈕', async () => {
    const { rows } = await setup([
      article('01老街', street),
      article('02沒有座標', noGeometry),
    ])
    expect(rows[0].querySelector('.header-action')).not.toBeNull()
    expect(rows[1].querySelector('.header-title')?.textContent).toBe(
      '02沒有座標',
    )
    expect(rows[1].querySelector('.header-action')).toBeNull()
    expect(rows[1].querySelector('.geonavigator')).toBeNull()
  })

  it('舊來源的文章沒有 feature，同樣沒有定位、導航鈕', async () => {
    const { rows } = await setup([article('舊文章')])
    expect(rows[0].querySelector('.header-action')).toBeNull()
    expect(rows[0].querySelector('.geonavigator')).toBeNull()
  })
})
