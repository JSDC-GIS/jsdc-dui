import { keyBy, mapKeys } from 'lodash'

export type DetailArticleType = {
  title: string
  subtitle?: string
  content: string
  imgSrc: string
  ref?: string
  link: string
}

export type DetailArticleInCompleteType = Omit<DetailArticleType, "ref" | "subtitle">

type CacheType = {
  htmlString?: string
  html?: Document
  values: Array<DetailArticleInCompleteType>
  map: { [k: string]: DetailArticleType }
  mapValues: () => { [k: string]: DetailArticleType }
}

const cache: CacheType = {
  htmlString: undefined,
  html: undefined,
  values:[],
  map: {},
  mapValues () {
      cache.map = mapKeys(keyBy(cache.values, 'title'), (value, key) => key.slice(2))
      return cache.map
  }
}

const parseHTML = (htmlString: string) => {
    const parser = new DOMParser()
    return parser.parseFromString(htmlString, 'text/html')
}

const isArticleDetailComplete = (detail: DetailArticleType) => {
    return detail.subtitle && detail.ref && detail.content
}

const getArticlesFromHTML = async (html: Document, refresh = false) => {
    if (cache.values.length > 0 && !refresh) return cache.values
    const elems = Array.from(html.getElementsByClassName('sppb-addon-article'))
    
    cache.values = elems.map(item => ({
        title: item.getElementsByTagName('h3')[0] ? item.getElementsByTagName('h3')[0].innerText : '',
        content: item.getElementsByClassName('sppb-article-introtext')[0] ? (item.getElementsByClassName('sppb-article-introtext')[0] as HTMLElement).innerText : '',
        imgSrc: item.getElementsByTagName('img')[0] ? item.getElementsByTagName('img')[0].src : '',
        link: (item.firstChild as HTMLLinkElement).href
    }))
    cache.mapValues()
    return cache.values
}

const getDetailFromHTML = (html: Document) => {
    const articleElem = html.getElementsByTagName('article')[0]
    if (!articleElem) throw new Error('cant find article')

    const subtitleElem = articleElem.getElementsByClassName('tags')[0] as HTMLElement
    const authorElem = articleElem.getElementsByClassName('badge')[0] as HTMLElement
    const contentElem = articleElem.getElementsByClassName('sppb-addon-content')[0].firstChild as HTMLElement

    const subtitle = subtitleElem ? subtitleElem.innerText : ''
    const author = authorElem ? authorElem.innerText : ''
    const content = contentElem ? contentElem.innerText : ''
    return { subtitle, ref: author, content}
}

class ArticleProxyParser {
  proxyFetcher: (url: string) => Promise<string>
  cmsPath: string
  constructor (options: {
    proxyFetcher: (url: string) => Promise<string>,
    cmsPath: string
  }) {
    this.proxyFetcher = options.proxyFetcher
    this.cmsPath = options.cmsPath
  }

  get url () {
    const baseCmsUrl = 'https://dguidedwalks.tw/'
    return baseCmsUrl + encodeURI(this.cmsPath)
  }

  async getDetailByTitle (title: string) {
    if (cache.values.length < 1) await this.getAll()
    const result = cache.map[title]
    if (!result) throw new Error(`cant find title: ${title}`)
    if (isArticleDetailComplete(result)) return result
    else {
        const htmlString = await this.proxyFetcher(result.link)
        const html = parseHTML(htmlString)
        const detail = getDetailFromHTML(html)
        cache.map[title] = { ...result, ...detail }
        return cache.map[title]
    }
  }

  async getAll (refresh: boolean = false) {
    let html: Document
    if (cache.html && !refresh) {
      html = cache.html
    } else {
      cache.htmlString = await this.proxyFetcher(this.url)
      cache.html = parseHTML(cache.htmlString)
      html = cache.html
    }
    return await getArticlesFromHTML(html)
  }
}

export default ArticleProxyParser
