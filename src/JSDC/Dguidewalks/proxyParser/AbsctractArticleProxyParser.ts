import { map } from 'lodash'
import {
  ArticleExternalProps,
  DetailArticleType,
  SummaryArticleType,
} from './@types'
import { normalizeTitle } from '../../utils/normalizeTitle'

export type AbsctractArticleProxyParserContructor = {
  proxyFetcher: (url: string) => Promise<string>
  cmsPath: string[]
  apiUrls?: string[]
}

export class ArticleCache {
  summaryMap: { [k: string]: SummaryArticleType } = {}
  externalMap: { [k: string]: ArticleExternalProps } = {}
  /** 正規化後的 title → summaryMap 的 canonical key */
  normalizedMap: { [normalizedKey: string]: string } = {}

  /**
   * 一次建立 summaryMap 與 normalizedMap，兩份索引必須同時寫入才不會走鐘。
   */
  setSummaries(articles: SummaryArticleType[]) {
    this.summaryMap = {}
    this.normalizedMap = {}
    for (const article of articles) {
      this.summaryMap[article.title] = article
      const normalizedKey = normalizeTitle(article.title)
      if (!normalizedKey) continue
      // 正規化後撞名時保留先進的那筆，避免靜默覆蓋
      if (
        Object.prototype.hasOwnProperty.call(this.normalizedMap, normalizedKey)
      ) {
        console.warn(
          `duplicated normalized title: "${article.title}" collides with "${this.normalizedMap[normalizedKey]}"`,
        )
        continue
      }
      this.normalizedMap[normalizedKey] = article.title
    }
  }

  /**
   * 以任意寫法的 title 找出 summaryMap 的 canonical key：
   * 先試字面精確命中，miss 再退到正規化比對（大小寫、空白、換行、全半形）。
   */
  resolveKey(title: string): string | undefined {
    if (Object.prototype.hasOwnProperty.call(this.summaryMap, title)) {
      return title
    }
    // 兩份索引都是 plain object，必須用 hasOwnProperty 擋掉
    // 'constructor'、'toString' 這類 prototype 屬性名的誤判
    const normalizedKey = normalizeTitle(title)
    return Object.prototype.hasOwnProperty.call(
      this.normalizedMap,
      normalizedKey,
    )
      ? this.normalizedMap[normalizedKey]
      : undefined
  }

  hasArticles() {
    return this.articles.length > 0
  }
  hasExternalKey(key: string) {
    return Object.prototype.hasOwnProperty.call(this.externalMap, key)
  }
  get articles() {
    const remap = map(this.summaryMap, (value, key) => ({
      ...value,
      ...this.externalMap[key],
    }))
    return Object.values(remap)
  }
}

abstract class AbsctractArticleProxyParser {
  proxyFetcher: AbsctractArticleProxyParserContructor['proxyFetcher']
  cmsPath: AbsctractArticleProxyParserContructor['cmsPath']
  apiUrls: string[]
  cache = new ArticleCache()
  language = 'zh-TW'

  constructor(options: AbsctractArticleProxyParserContructor) {
    this.proxyFetcher = options.proxyFetcher
    this.cmsPath = options.cmsPath
    this.apiUrls = options.apiUrls || [
      'https://dguidedwalks.tw/jsonapi/node/listing',
    ]
  }

  get isEnglish() {
    return this.language.startsWith('en')
  }

  // 快取只以 title 為 key，並無語系概念，故換語言時必須整個丟掉重抓，
  // 否則 getAll 會在 hasArticles() 直接 early return 而回傳舊語系內容。
  setLanguage(language?: string) {
    if (!language || language === this.language) return
    this.language = language
    this.cache = new ArticleCache()
  }

  // 以前爬蟲使用，改用 API 後無使用
  get url() {
    const baseCmsUrl = 'https://dguidedwalks.tw/'
    return baseCmsUrl + encodeURI(this.cmsPath[0] || '')
  }

  parseHTML(htmlString: string) {
    const parser = new DOMParser()
    return parser.parseFromString(htmlString, 'text/html')
  }

  isArticleDetailComplete(detail: DetailArticleType) {
    return detail.subtitle && detail.ref && detail.content
  }
}

export default AbsctractArticleProxyParser
