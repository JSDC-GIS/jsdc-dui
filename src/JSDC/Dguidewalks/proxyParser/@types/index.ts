import type { SceneFeature } from '../../ApiProvider'

export interface IArticleProxyParser {
  getAll: (
    refresh?: boolean,
    language?: string,
  ) => Promise<SummaryArticleType[]>
  setLanguage: (language?: string) => void
  /**
   * 由景點 feature 取內文，jsdc-dui 內部只走這一條。
   * 介面刻意不含 title 版本：景點一律用 feature / id 識別，
   * 只有舊的 Drupal parser 自己在實作裡用 title 反查（它的資料來源沒有 id）。
   */
  getDetailByFeature: (
    feature: SceneFeature,
  ) => DetailArticleType | Promise<DetailArticleType>
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
  /** 景點 id（Strapi `feature.id`）。舊的 Drupal 來源沒有 id，所以是選填。 */
  id?: string
  /**
   * 這筆文章對應的景點 feature；列表的定位、導航鈕靠它識別景點，不再用 title 反查。
   * 舊的 Drupal 來源沒有，列表就不顯示這兩個鈕。
   */
  feature?: SceneFeature
}

export type Article = SummaryArticleType & Partial<ArticleExternalProps>

export type DetailArticleType = SummaryArticleType & ArticleExternalProps
