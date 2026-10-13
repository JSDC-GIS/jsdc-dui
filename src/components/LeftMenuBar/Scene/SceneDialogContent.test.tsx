import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { DguidewalksContext } from '../../../JSDC/Dguidewalks/Context'
import {
  SceneFeature,
  SceneProperties,
} from '../../../JSDC/Dguidewalks/ApiProvider'
import { SummaryArticleType } from '../../../JSDC/Dguidewalks/proxyParser/@types'
import SceneDialogContent from './SceneDialogContent'
import icon from '../../../icon'

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
  { imgSrc = '', link = '' } = {},
): SummaryArticleType => ({
  id: feature?.id,
  feature,
  title,
  content: '',
  imgSrc,
  link,
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

  it('沒有圖片的景點顯示預設圖，有圖片的照常顯示', async () => {
    const { rows } = await setup([
      article('01老街', street, { imgSrc: 'https://media.test/small_01.jpg' }),
      article('01老街入口', entrance),
    ])
    const images = rows.map(
      (row) => row.querySelector('img') as HTMLImageElement,
    )
    expect(images[0].getAttribute('src')).toBe(
      'https://media.test/small_01.jpg',
    )
    expect(images[0].className).toBe('')
    expect(images[1].getAttribute('src')).toBe(icon.others.noImage)
    expect(images[1].className).toBe('no-image')
    expect(icon.others.noImage).toMatch(/^data:image\/png;base64,iVBOR/)
  })

  it('沒有 pageUrl 的景點不顯示「more」', async () => {
    const { rows } = await setup([
      article('01老街', street, { link: 'https://page.test/01老街/' }),
      article('01老街入口', entrance),
      article('02沒有座標', noGeometry, { link: null as unknown as string }),
    ])
    expect(rows[0].querySelector('a.more')?.getAttribute('href')).toBe(
      'https://page.test/01老街/',
    )
    expect(rows[1].querySelector('a.more')).toBeNull()
    expect(rows[2].querySelector('a.more')).toBeNull()
    // 頁數仍然照常顯示
    expect(rows[1].querySelector('.count')?.textContent).toBe('02/3')
  })
})
