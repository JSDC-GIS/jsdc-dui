import { map } from 'lodash'
import {
  ArticleExternalProps,
  DetailArticleType,
  SummaryArticleType,
} from './@types'

export type AbsctractArticleProxyParserContructor = {
  proxyFetcher: (url: string) => Promise<string>
  cmsPath: string[]
  apiUrls?: string[]
}

class ArticleCache {
  summaryMap: { [k: string]: SummaryArticleType } = {}
  externalMap: { [k: string]: ArticleExternalProps } = {}

  hasArticles() {
    return this.articles.length > 0
  }
  hasExternalKey(key: string) {
    return !!this.externalMap[key]
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
