import { ArticleCache } from './AbsctractArticleProxyParser'
import { SummaryArticleType } from './@types'

const article = (title: string): SummaryArticleType => ({
  title,
  content: 'content',
  imgSrc: 'null',
  link: 'https://dguidedwalks.tw/x',
})

describe('ArticleCache.resolveKey', () => {
  const cache = new ArticleCache()
  cache.setSummaries([article('三坑老街'), article('Daxi Old Street')])

  it('字面完全相同時直接命中', () => {
    expect(cache.resolveKey('三坑老街')).toBe('三坑老街')
  })

  it('容忍空白與換行差異，回傳 canonical key', () => {
    expect(cache.resolveKey('  三坑 老街 ')).toBe('三坑老街')
    expect(cache.resolveKey('三坑\n老街')).toBe('三坑老街')
    expect(cache.resolveKey('三坑\\n老街')).toBe('三坑老街')
  })

  it('容忍英文大小寫差異', () => {
    expect(cache.resolveKey('daxi old street')).toBe('Daxi Old Street')
  })

  it('找不到時回傳 undefined，不亂配', () => {
    expect(cache.resolveKey('大溪老街')).toBeUndefined()
  })

  it('不會被 prototype 上的屬性名誤判', () => {
    expect(cache.resolveKey('constructor')).toBeUndefined()
    expect(cache.resolveKey('toString')).toBeUndefined()
  })
})
