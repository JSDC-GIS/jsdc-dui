import {
  getPreloadStatus,
  preloadImage,
  resetPreloadedImages,
} from './preloadImage'

type FakeImage = { src: string; onload?: () => void; onerror?: () => void }

describe('preloadImage', () => {
  let images: FakeImage[]
  let warnSpy: jest.SpyInstance
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
  })

  afterEach(() => {
    ;(global as any).Image = OriginalImage
    warnSpy.mockRestore()
  })

  it('載入成功 resolve true，狀態從 loading 變 loaded', async () => {
    expect(getPreloadStatus('https://x.test/a.png')).toBeUndefined()
    const promise = preloadImage('https://x.test/a.png')
    expect(images.map((image) => image.src)).toEqual(['https://x.test/a.png'])
    expect(getPreloadStatus('https://x.test/a.png')).toBe('loading')
    images[0].onload!()
    await expect(promise).resolves.toBe(true)
    expect(getPreloadStatus('https://x.test/a.png')).toBe('loaded')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('載入失敗 resolve false（不 reject）並 warn 一次', async () => {
    const promise = preloadImage('https://x.test/404.png')
    images[0].onerror!()
    await expect(promise).resolves.toBe(false)
    expect(getPreloadStatus('https://x.test/404.png')).toBe('failed')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain('https://x.test/404.png')
  })

  it('同一個網址不重複下載：載入中、成功後、失敗後再呼叫都是同一個 promise', async () => {
    const first = preloadImage('https://x.test/a.png')
    expect(preloadImage('https://x.test/a.png')).toBe(first)
    images[0].onload!()
    await first
    expect(preloadImage('https://x.test/a.png')).toBe(first)

    const failed = preloadImage('https://x.test/404.png')
    images[1].onerror!()
    await failed
    expect(preloadImage('https://x.test/404.png')).toBe(failed)
    expect(images).toHaveLength(2)
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('網址是 Object 原型上的屬性名稱也不會誤判', () => {
    expect(getPreloadStatus('toString')).toBeUndefined()
    expect(getPreloadStatus('constructor')).toBeUndefined()
  })
})
