import { act, render } from '@testing-library/react'
import React from 'react'
import { WalkViewerAssets } from '../JSDC/Dguidewalks/ApiProvider'
import { ViewerImageAssets } from '../JSDC/Dguidewalks/viewerAssets'
import { resetPreloadedImages } from '../utils/preloadImage'
import usePreloadedViewerImages from './usePreloadedViewerImages'

type FakeImage = { src: string; onload?: () => void; onerror?: () => void }

const D = 'https://strapi.test/key-art_Desktop.png'
const M = 'https://strapi.test/key-art_mobile.jpg'
const A = 'https://strapi.test/about.png'
const NONE = { headerDesktop: null, headerMobile: null, about: null }

describe('usePreloadedViewerImages', () => {
  let images: FakeImage[]
  let warnSpy: jest.SpyInstance
  let errorSpy: jest.SpyInstance
  const OriginalImage = global.Image

  beforeEach(() => {
    resetPreloadedImages()
    images = []
    ;(global as any).Image = class {
      src = ''
      constructor() {
        images.push(this)
      }
    }
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    ;(global as any).Image = OriginalImage
    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })

  const settle = async (src: string, kind: 'load' | 'error') => {
    await act(async () => {
      const image = images.find((item) => item.src === src)!
      kind === 'load' ? image.onload!() : image.onerror!()
      await Promise.resolve()
    })
  }

  const setup = (viewerAssets?: Partial<WalkViewerAssets> | null) => {
    const ref: { value?: ViewerImageAssets; renders: number } = { renders: 0 }
    const Probe = ({
      assets,
    }: {
      assets?: Partial<WalkViewerAssets> | null
    }) => {
      ref.value = usePreloadedViewerImages(assets as WalkViewerAssets)
      ref.renders++
      return null
    }
    const view = render(<Probe assets={viewerAssets} />)
    return {
      ref,
      unmount: view.unmount,
      rerender: (assets?: Partial<WalkViewerAssets> | null) =>
        view.rerender(<Probe assets={assets} />),
    }
  }

  it('載入成功才出現在結果裡，各張獨立', async () => {
    const { ref } = setup({ headerDesktop: D, headerMobile: M, about: A })
    expect(images.map((image) => image.src)).toEqual([D, M, A])
    expect(ref.value).toEqual(NONE)
    await settle(M, 'load')
    expect(ref.value).toEqual({ ...NONE, headerMobile: M })
    await settle(D, 'load')
    await settle(A, 'load')
    expect(ref.value).toEqual({ headerDesktop: D, headerMobile: M, about: A })
  })

  it('載入失敗的維持 null（呼叫端繼續用下游的圖）並 warn 一次', async () => {
    const { ref, rerender } = setup({ headerDesktop: D, about: A })
    await settle(D, 'error')
    await settle(A, 'load')
    expect(ref.value).toEqual({ ...NONE, about: A })
    expect(warnSpy).toHaveBeenCalledTimes(1)
    // 重新渲染不會重試、不會再 warn
    rerender({ headerDesktop: D, about: A })
    expect(images).toHaveLength(2)
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it.each([
    [undefined],
    [null],
    [{}],
    [{ headerDesktop: null, headerMobile: '', about: '  ' }],
    [{ logo: 'https://strapi.test/logo.png' }],
  ])('viewerAssets 沒有圖（%p）時完全不觸發預載', (viewerAssets) => {
    const { ref } = setup(viewerAssets as Partial<WalkViewerAssets>)
    expect(images).toEqual([])
    expect(ref.value).toEqual(NONE)
  })

  it('/walks 回來前是 undefined，回來後才開始預載', async () => {
    const { ref, rerender } = setup(undefined)
    expect(images).toEqual([])
    rerender({ headerDesktop: D })
    expect(images.map((image) => image.src)).toEqual([D])
    await settle(D, 'load')
    expect(ref.value).toEqual({ ...NONE, headerDesktop: D })
  })

  it('同一張圖不重複預載：重新渲染（即使 viewerAssets 是新物件）不會再下載', async () => {
    const { rerender } = setup({ headerDesktop: D })
    rerender({ headerDesktop: D })
    rerender({ headerDesktop: D, logo: 'https://strapi.test/logo.png' })
    expect(images).toHaveLength(1)
    await settle(D, 'load')
    rerender({ headerDesktop: D })
    expect(images).toHaveLength(1)
  })

  it('已經載過的圖：新掛上的元件第一次渲染就是載好的值，不會先退回 fallback', async () => {
    const first = setup({ headerDesktop: D })
    await settle(D, 'load')
    first.unmount()
    const second = setup({ headerDesktop: D })
    expect(second.ref.value).toEqual({ ...NONE, headerDesktop: D })
    expect(second.ref.renders).toBe(1)
    expect(images).toHaveLength(1)
  })

  it('結果的物件在沒有變化時維持同一個參考（context 不會無謂重算）', async () => {
    const { ref, rerender } = setup({ headerDesktop: D })
    await settle(D, 'load')
    const value = ref.value
    rerender({ headerDesktop: D })
    expect(ref.value).toBe(value)
  })

  it('卸載後才載完：不再更新 state（沒有重新渲染，也沒有 React 警告）', async () => {
    const { ref, unmount } = setup({ headerDesktop: D })
    const renders = ref.renders
    unmount()
    await settle(D, 'load')
    expect(ref.renders).toBe(renders)
    expect(ref.value).toEqual(NONE)
    expect(
      errorSpy.mock.calls.filter(([message]) =>
        /unmounted component/.test(String(message)),
      ),
    ).toEqual([])
  })
})
