import { SummaryArticleType, IArticleProxyParser } from './@types'
import AbsctractArticleProxyParser, {
  AbsctractArticleProxyParserContructor,
} from './AbsctractArticleProxyParser'
import axios from 'axios'

class ArticleProxyParser
  extends AbsctractArticleProxyParser
  implements IArticleProxyParser
{
  constructor(options: AbsctractArticleProxyParserContructor) {
    super(options)
  }

  async getAll(refresh?: boolean | undefined): Promise<SummaryArticleType[]> {
    if (this.cache.hasArticles()) return this.cache.articles
    // const htmlString = await this.proxyFetcher(this.url)
    // const dom = this.parseHTML(htmlString)
    const articles = await this.getArticlesFromAPI()
    const cache = this.cache
    cache.summaryMap = articles.reduce(
      (obj, article) => {
        obj[article.title] = article
        return obj
      },
      {} as typeof cache.summaryMap,
    )
    return articles
  }

  async getDetailByTitle(
    title: string,
    fallbackUrl?: string | null | undefined,
  ) {
    const article = this.cache.summaryMap[title]
    const externalProps = this.cache.externalMap[title]
    const hasArticle = !!article
    const hasExternal = this.cache.hasExternalKey(title)

    if (hasArticle) {
      if (hasExternal) return { ...article, ...externalProps }

      // const htmlString = await this.proxyFetcher(article.link)
      // const dom = this.parseHTML(htmlString)
      const externalDetail = await this.getExternalDetailFromAPI(title)

      this.cache.externalMap[title] = externalDetail
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
      // 從所有 API URL 取得資料
      const responses = await Promise.all(
        this.apiUrls.map((url) =>
          axios.get(url).catch((error) => {
            console.error(`Error fetching from ${url}:`, error)
            return null
          }),
        ),
      )

      // 合併所有回應的資料
      const allData = responses
        .filter((response) => response !== null)
        .flatMap((response) => response!.data.data)
        .filter((item: any) =>
          item.attributes.path?.alias.includes(this.cmsPath),
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

      const result: SummaryArticleType[] = await Promise.all(
        allData.map(async (item: any) => {
          const title: string = item.attributes.title || 'null'
          let content: string = item.attributes.body?.summary || 'null'
          if (content.length > 34) {
            content = content.substring(0, 34) + '......'
          }
          const link: string = `https://dguidedwalks.no1tree.tw/zh-hant${
            item.attributes.path?.alias || ''
          }`

          let imgSrc: string = 'null'
          if (item.relationships?.field_listing_image?.links?.related?.href) {
            try {
              const imgResponse = await axios.get(
                item.relationships.field_listing_image.links.related.href,
              )
              imgSrc = `https://dguidedwalks.no1tree.tw/${imgResponse.data.data.attributes.uri.url}`
            } catch (error) {
              console.error('Error fetching image:', error)
            }
          }

          return { title, content, imgSrc, link }
        }),
      )

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

      const item = allData.find(
        (element: any) => element.attributes.title === title,
      )

      if (item) {
        const subtitle: string = item.attributes.title || 'null'
        const ref: string =
          `撰稿者：${item.attributes.field_listing_author}` || 'null'
        const content: string = item.attributes.body?.summary || 'null'

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
