export interface IArticleProxyParser {
  getDetailByTitle: (
    title: string,
    fallbackUrl?: string | null,
  ) => Promise<DetailArticleType>
  getAll: (
    refresh?: boolean,
    language?: string,
  ) => Promise<SummaryArticleType[]>
  setLanguage: (language?: string) => void
}

/** Drupal JSON:API 的文字欄位形狀（body、field_english_text …） */
export type ListingTextField = {
  value?: string
  summary?: string
  processed?: string
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
