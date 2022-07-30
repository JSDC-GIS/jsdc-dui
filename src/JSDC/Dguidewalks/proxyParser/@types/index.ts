export interface IArticleProxyParser {
    getDetailByTitle: (title: string, fallbackUrl?: string | null) => Promise<DetailArticleType>
    getAll: (refresh?: boolean) => Promise<SummaryArticleType[]>
}

export type ArticleExternalProps = {
    content: string
    subtitle: string
    ref: string
}

export type SummaryArticleType = {
    title: string
    content: string
    imgSrc: string
    link: string
}

export type Article = SummaryArticleType & Partial<ArticleExternalProps>

export type DetailArticleType = SummaryArticleType & ArticleExternalProps
