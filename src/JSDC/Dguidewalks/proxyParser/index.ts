import { SummaryArticleType, IArticleProxyParser } from './@types'
import AbsctractArticleProxyParser, {
  AbsctractArticleProxyParserContructor,
} from './AbsctractArticleProxyParser'

class ArticleProxyParser
  extends AbsctractArticleProxyParser
  implements IArticleProxyParser
{
  constructor(options: AbsctractArticleProxyParserContructor) {
    super(options)
  }

  async getAll(refresh?: boolean | undefined): Promise<SummaryArticleType[]> {
    if (this.cache.hasArticles()) return this.cache.articles
    const htmlString = await this.proxyFetcher(this.url)
    const dom = this.parseHTML(htmlString)
    const articles = this.getArticlesFromHTML(dom)
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

      const htmlString = await this.proxyFetcher(article.link)
      const dom = this.parseHTML(htmlString)
      const externalDetail = this.getExternalDetailFromHTML(dom)

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
}

export default ArticleProxyParser
