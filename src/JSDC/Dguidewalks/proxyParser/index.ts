import {
  SummaryArticleType,
  IArticleProxyParser,
  ListingTextField,
} from './@types'
import AbsctractArticleProxyParser, {
  AbsctractArticleProxyParserContructor,
} from './AbsctractArticleProxyParser'
import axios from 'axios'
import { normalizeTitle } from '../../utils/normalizeTitle'

class ArticleProxyParser
  extends AbsctractArticleProxyParser
  implements IArticleProxyParser
{
  constructor(options: AbsctractArticleProxyParserContructor) {
    super(options)
  }

  // 英文內文放在 field_english_text.value；CMS 尚未補齊的節點該欄位為空，
  // 此時 fallback 回中文的 body.summary。
  pickContent(attributes: any): { text: string; isEnglish: boolean } {
    const englishText = (
      attributes.field_english_text as ListingTextField | undefined
    )?.value?.trim()
    if (this.isEnglish && englishText) {
      return { text: englishText, isEnglish: true }
    }
    return { text: attributes.body?.summary || 'null', isEnglish: false }
  }

  async getAll(
    refresh?: boolean | undefined,
    language?: string,
  ): Promise<SummaryArticleType[]> {
    this.setLanguage(language)
    if (this.cache.hasArticles()) return this.cache.articles
    // const htmlString = await this.proxyFetcher(this.url)
    // const dom = this.parseHTML(htmlString)
    const articles = await this.getArticlesFromAPI()
    this.cache.setSummaries(articles)
    return articles
  }

  async getDetailByTitle(
    title: string,
    fallbackUrl?: string | null | undefined,
  ) {
    // 傳進來的 title 可能與 CMS 的寫法有大小寫/空白/換行差異，
    // 先解析出 canonical key，之後所有 cache 讀寫都用它，
    // 否則同一景點的不同寫法會在 externalMap 灌成多筆。
    const key = this.cache.resolveKey(title)
    const article = key ? this.cache.summaryMap[key] : undefined

    if (key && article) {
      const externalProps = this.cache.externalMap[key]
      if (this.cache.hasExternalKey(key)) {
        return { ...article, ...externalProps }
      }

      // const htmlString = await this.proxyFetcher(article.link)
      // const dom = this.parseHTML(htmlString)
      const externalDetail = await this.getExternalDetailFromAPI(key)

      this.cache.externalMap[key] = externalDetail
      return { ...article, ...externalDetail }
    }

    throw new Error(`failed to get by title: ${title}, get all article first`)
  }

  getArticlesFromHTML(dom: Document) {
    const articleCards = Array.from(dom.querySelectorAll('.sppb-addon-article'))
    const result: SummaryArticleType[] = articleCards.map((cardElem) => {
      const title: string = cardElem.querySelector('h3')?.innerText || 'null'
      const content: string =
        cardElem.querySelector('.sppb-article-introtext')?.innerHTML || 'null'
      const imgSrc: string =
        (cardElem.querySelector('a img') as HTMLImageElement).src || 'null'
      const link: string = cardElem.querySelector('a')?.href || 'null'
      return { title, content, imgSrc, link }
    })
    return result
  }

  async getArticlesFromAPI(): Promise<SummaryArticleType[]> {
    try {
      const withInclude = (url: string) =>
        url + (url.includes('?') ? '&' : '?') + 'include=field_listing_image'

      const responses = await Promise.all(
        this.apiUrls.map((url) =>
          axios.get(withInclude(url)).catch((error) => {
            console.error(`Error fetching from ${url}:`, error)
            return null
          }),
        ),
      )

      const includedById = new Map<string, any>()
      for (const response of responses) {
        if (!response) continue
        for (const item of response.data.included ?? []) {
          includedById.set(item.id, item)
        }
      }

      const allData = responses
        .filter((response) => response !== null)
        .flatMap((response) => response!.data.data)
        .filter((item: any) =>
          this.cmsPath.some((path) =>
            item.attributes.path?.alias.includes(path),
          ),
        )
        .sort((itemA: any, itemB: any) => {
          const numA = parseInt(
            itemA.attributes.title.match(/^\d+/)?.[0] || '0',
          )
          const numB = parseInt(
            itemB.attributes.title.match(/^\d+/)?.[0] || '0',
          )
          return numA - numB
        })

      const result: SummaryArticleType[] = allData.map((item: any) => {
        const title: string = item.attributes.title || 'null'
        const { text, isEnglish } = this.pickContent(item.attributes)
        // 34 是為中文排版調的；英文字元窄很多，放寬到 90 才有相近的視覺長度。
        const limit = isEnglish ? 90 : 34
        let content: string = text
        if (content.length > limit) {
          content = content.substring(0, limit) + '......'
        }
        const link: string = `https://dguidedwalks.tw${
          item.attributes.path?.alias || ''
        }`

        const imageId = item.relationships?.field_listing_image?.data?.id
        const imageUrl = imageId
          ? includedById.get(imageId)?.attributes?.uri?.url
          : undefined
        const imgSrc: string = imageUrl
          ? `https://dguidedwalks.tw${imageUrl}`
          : 'null'

        return { title, content, imgSrc, link }
      })

      return result
    } catch (error) {
      console.error('Error fetching articles:', error)
      return []
    }
  }

  getExternalDetailFromHTML(dom: Document) {
    const newContent = (
      dom.querySelector('.sppb-addon-content p.d-h3') as HTMLHeadingElement
    )?.innerText
    const subtitle = (
      dom.querySelector('.entry-header .tags') as HTMLDivElement
    )?.innerText
    const ref = (
      dom.querySelector(
        '.sppb-addon-content p:nth-child(4) span',
      ) as HTMLSpanElement
    )?.innerText
    return { subtitle, ref, content: newContent }
  }

  async getExternalDetailFromAPI(title: string): Promise<{
    subtitle: string
    ref: string
    content: string
  }> {
    try {
      // 從所有 API URL 取得資料
      const responses = await Promise.all(
        this.apiUrls.map((url) =>
          axios.get(url).catch((error) => {
            console.error(`Error fetching from ${url}:`, error)
            return null
          }),
        ),
      )

      // 合併所有回應的資料並尋找符合的項目
      const allData = responses
        .filter((response) => response !== null)
        .flatMap((response) => response!.data.data)

      // 這批資料沒經過 cache 也沒套 cmsPath 過濾，自行正規化比對才不會 miss
      const normalized = normalizeTitle(title)
      const item = allData.find(
        (element: any) =>
          normalizeTitle(element.attributes.title ?? '') === normalized,
      )

      if (item) {
        const subtitle: string = item.attributes.title || 'null'
        const ref: string =
          `撰稿者：${item.attributes.field_listing_author}` || 'null'
        const content: string = this.pickContent(item.attributes).text

        return { subtitle, ref, content }
      }

      return { subtitle: 'null', ref: 'null', content: 'null' }
    } catch (error) {
      console.error('Error fetching external detail:', error)
      return { subtitle: 'null', ref: 'null', content: 'null' }
    }
  }
}

export default ArticleProxyParser
