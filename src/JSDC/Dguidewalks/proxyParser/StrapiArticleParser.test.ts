import StrapiArticleParser from './StrapiArticleParser'
import { SceneFeature, SceneProperties, WalkResponse } from '../ApiProvider'

// 只填 parser 會讀到的欄位
const scene = (
  id: string,
  props: Partial<SceneProperties> = {},
): SceneFeature => ({
  type: 'Feature',
  id,
  geometry: { type: 'Point', coordinates: [121.28, 24.88] },
  properties: {
    title: id,
    summary: `${id} 的中文介紹`,
    summaryEn: null,
    coverImage: `https://media.test/${id}.jpg`,
    coverThumb: `https://media.test/small_${id}.jpg`,
    contributors: '方文樹、林炯任',
    pageUrl: `https://page.test/${id}/`,
    legacyGisId: null,
    legacyName: null,
    ...props,
  } as SceneProperties,
})

const zhLong = '中'.repeat(40)
const enLong = 'e'.repeat(100)

const features = [
  scene('02通議第', { summary: zhLong, summaryEn: enLong }),
  scene('01大溪老街區', { summaryEn: '   ' }),
  scene('03沒有內文', { summary: null, contributors: null }),
  scene('04只有大圖', { coverThumb: null }),
  scene('05只有小圖', { coverImage: null }),
  scene('06沒有圖', { coverImage: null, coverThumb: null }),
  scene('07三坑老街'),
  scene('三坑'),
]

const createParser = (walkFeatures = features) => {
  const loadWalk = jest.fn(
    async () => ({ pois: { features: walkFeatures } }) as WalkResponse,
  )
  return { parser: new StrapiArticleParser({ loadWalk }), loadWalk }
}

describe('StrapiArticleParser.getAll', () => {
  it('順序照 API 回傳，不依 title 前綴重排', async () => {
    const { parser } = createParser()
    const articles = await parser.getAll()
    expect(articles.map((article) => article.title)).toEqual(
      features.map((feature) => feature.properties.title),
    )
  })

  it('每筆都帶景點 id（feature.id）與 feature 本身，title 相同也分得開', async () => {
    const twins = [
      scene('doc-a', { title: '01老街' }),
      scene('doc-b', { title: '01老街' }),
      scene('doc-c', { title: '01老街入口' }),
    ]
    const { parser } = createParser(twins)
    const articles = await parser.getAll()
    expect(articles.map((article) => article.id)).toEqual([
      'doc-a',
      'doc-b',
      'doc-c',
    ])
    articles.forEach((article, index) =>
      expect(article.feature).toBe(twins[index]),
    )
  })

  it('title、link 直接取 properties', async () => {
    const { parser } = createParser()
    const [, article] = await parser.getAll()
    expect(article.title).toBe('01大溪老街區')
    expect(article.link).toBe('https://page.test/01大溪老街區/')
    expect(article.content).toBe('01大溪老街區 的中文介紹')
  })

  it('中文摘要超過 34 字截斷', async () => {
    const { parser } = createParser()
    const [article] = await parser.getAll(undefined, 'zh-TW')
    expect(article.content).toBe('中'.repeat(34) + '......')
  })

  it('英文用 summaryEn，超過 90 字截斷', async () => {
    const { parser } = createParser()
    const [article] = await parser.getAll(undefined, 'en')
    expect(article.content).toBe('e'.repeat(90) + '......')
  })

  it('英文沒填（null 或只有空白）時退回中文，截斷長度也用中文的', async () => {
    const { parser } = createParser([
      scene('a', { summary: zhLong, summaryEn: null }),
      scene('b', { summary: zhLong, summaryEn: ' \n ' }),
    ])
    const articles = await parser.getAll(undefined, 'en')
    expect(articles.map((article) => article.content)).toEqual([
      '中'.repeat(34) + '......',
      '中'.repeat(34) + '......',
    ])
  })

  it('summary 為 null 時是空字串，不是字面的 "null"', async () => {
    const { parser } = createParser()
    const article = (await parser.getAll())[2]
    expect(article.content).toBe('')
    expect((await parser.getAll(undefined, 'en'))[2].content).toBe('')
  })

  it('列表圖片：coverThumb 優先，沒有才用 coverImage，都沒有是空字串', async () => {
    const { parser } = createParser()
    const articles = await parser.getAll()
    expect(articles[1].imgSrc).toBe('https://media.test/small_01大溪老街區.jpg')
    expect(articles[3].imgSrc).toBe('https://media.test/04只有大圖.jpg')
    expect(articles[5].imgSrc).toBe('')
  })

  it('換語言不重抓，也不需要清快取', async () => {
    const { parser, loadWalk } = createParser()
    const zh = await parser.getAll(undefined, 'zh-TW')
    const en = await parser.getAll(undefined, 'en')
    const zhAgain = await parser.getAll(undefined, 'zh-TW')
    expect(zh[0].content).toBe('中'.repeat(34) + '......')
    expect(en[0].content).toBe('e'.repeat(90) + '......')
    expect(zhAgain).toEqual(zh)
    // loadWalk 由 Dguidewalks 快取；parser 自己不留第二份資料
    expect(loadWalk).toHaveBeenCalledTimes(3)
  })

  it('walk 載入失敗時回傳空陣列', async () => {
    const parser = new StrapiArticleParser({
      loadWalk: async () => {
        throw new Error('404')
      },
    })
    expect(await parser.getAll()).toEqual([])
  })
})

describe('StrapiArticleParser.getDetailByFeature', () => {
  const byId = (id: string) => features.find((feature) => feature.id === id)!

  it('直接讀 feature，不需要 walk 也不需要先呼叫 getAll', () => {
    const { parser, loadWalk } = createParser()
    expect(parser.getDetailByFeature(byId('01大溪老街區'))).toEqual({
      title: '01大溪老街區',
      subtitle: '01大溪老街區',
      content: '01大溪老街區 的中文介紹',
      imgSrc: 'https://media.test/01大溪老街區.jpg',
      link: 'https://page.test/01大溪老街區/',
      ref: '撰稿者：方文樹、林炯任',
    })
    expect(loadWalk).not.toHaveBeenCalled()
  })

  it('內文是全文不截斷，語系規則同列表', () => {
    const { parser } = createParser()
    expect(parser.getDetailByFeature(byId('02通議第')).content).toBe(zhLong)
    parser.setLanguage('en')
    expect(parser.getDetailByFeature(byId('02通議第')).content).toBe(enLong)
    expect(parser.getDetailByFeature(byId('01大溪老街區')).content).toBe(
      '01大溪老街區 的中文介紹',
    )
  })

  it('沒有內文時是空字串；沒有撰稿者時顯示「撰稿者：未知」', () => {
    const { parser } = createParser()
    const detail = parser.getDetailByFeature(byId('03沒有內文'))
    expect(detail.content).toBe('')
    expect(detail.ref).toBe('撰稿者：未知')
  })

  it('詳細圖片：coverImage 優先，沒有才用 coverThumb，都沒有是空字串', () => {
    const { parser } = createParser()
    const imgOf = (id: string) => parser.getDetailByFeature(byId(id)).imgSrc
    expect(imgOf('04只有大圖')).toBe('https://media.test/04只有大圖.jpg')
    expect(imgOf('05只有小圖')).toBe('https://media.test/small_05只有小圖.jpg')
    expect(imgOf('06沒有圖')).toBe('')
  })

  it('title 互相包含的景點各拿各的內文', () => {
    const { parser } = createParser()
    expect(parser.getDetailByFeature(byId('三坑')).title).toBe('三坑')
    expect(parser.getDetailByFeature(byId('07三坑老街')).title).toBe(
      '07三坑老街',
    )
  })

  it('沒有 title 版本的 API', () => {
    const { parser } = createParser()
    expect('getDetailByTitle' in parser).toBe(false)
  })
})
