import ArticleProxyParser from '.'
import { SummaryArticleType } from './@types'
import { AbsctractArticleProxyParserContructor } from './AbsctractArticleProxyParser'

class DaKeKanRiver2022Parser extends ArticleProxyParser {
  anchorId: string
  constructor(
    anchorId: string,
    options: AbsctractArticleProxyParserContructor,
  ) {
    super(options)
    this.anchorId = anchorId
  }

  getArticlesFromHTML(dom: Document): SummaryArticleType[] {
    const keyAnchor = dom.getElementById(this.anchorId)
    if (!keyAnchor)
      throw new Error(`miss key anchor ${this.anchorId} to locate html element`)
    const rootElem = keyAnchor.nextElementSibling as HTMLElement
    const articleCards = Array.from(
      rootElem.querySelectorAll('.sppb-addon-article'),
    )
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
}

export default DaKeKanRiver2022Parser
