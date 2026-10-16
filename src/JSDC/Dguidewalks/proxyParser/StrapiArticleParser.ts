import {
  DetailArticleType,
  IArticleProxyParser,
  SummaryArticleType,
} from './@types'
import { SceneFeature, WalkResponse } from '../ApiProvider'
import { toSceneContentHtml } from '../sceneBody'

export type StrapiArticleParserOptions = {
  /**
   * 取得 walk 回應。由 `Dguidewalks` 傳入它自己那一次（已快取的）請求，
   * 景點文字與地圖點位才會共用同一份資料，不會多打一次 `/walks/{code}`。
   */
  loadWalk: () => Promise<WalkResponse>
}

// 34 是為中文排版調的；英文字元窄很多，放寬到 90 才有相近的視覺長度。
const SUMMARY_LIMIT = { zh: 34, en: 90 }

/**
 * 景點文章來源（Strapi）：直接讀 `/walks/{code}` 回應裡每個景點的 properties。
 *
 * 中英文都在同一份回應裡，所以沒有快取、換語言也不必重抓。
 * 景點一律用 feature 識別（列表每筆都帶 `id` 與 `feature`），沒有 title 反查。
 */
class StrapiArticleParser implements IArticleProxyParser {
  private loadWalk: StrapiArticleParserOptions['loadWalk']
  language = 'zh-TW'

  constructor(options: StrapiArticleParserOptions) {
    this.loadWalk = options.loadWalk
  }

  get isEnglish() {
    return this.language.startsWith('en')
  }

  setLanguage(language?: string) {
    if (language) this.language = language
  }

  // walk 載入失敗時當作沒有景點；錯誤由 Dguidewalks.loadWalk 統一記錄
  private async getFeatures(): Promise<SceneFeature[]> {
    try {
      return (await this.loadWalk()).pois.features
    } catch (error) {
      return []
    }
  }

  // 英文版且有 titleEn 才換；中文版維持整段 title（雙語專案是「中文\n英文」兩行）。
  // 只影響顯示，集章 key 與用標題找景點仍用 title／legacyName。
  private pickTitle(feature: SceneFeature) {
    const { title, titleEn } = feature.properties
    const english = titleEn?.trim()
    return this.isEnglish && english ? english : title
  }

  // 英文沒填（null 或只有空白）的景點退回中文，CMS 大多數景點還沒補英文
  private pickContent(feature: SceneFeature) {
    const { summary, summaryEn } = feature.properties
    const english = summaryEn?.trim()
    if (this.isEnglish && english) return { text: english, isEnglish: true }
    return { text: summary ?? '', isEnglish: false }
  }

  // 卡片的內文：中文 body → summary；英文 bodyEn → summaryEn → body → summary。
  // 只有空白的欄位視同沒填。列表仍用 pickContent（純文字截短）。
  private pickBody(feature: SceneFeature) {
    const { body, bodyEn, summary, summaryEn } = feature.properties
    const candidates = this.isEnglish
      ? [bodyEn, summaryEn, body, summary]
      : [body, summary]
    return candidates.find((value) => value?.trim()) ?? ''
  }

  getSummaryByFeature(feature: SceneFeature): SummaryArticleType {
    const { coverThumb, coverImage, pageUrl } = feature.properties
    const title = this.pickTitle(feature)
    const { text, isEnglish } = this.pickContent(feature)
    const limit = isEnglish ? SUMMARY_LIMIT.en : SUMMARY_LIMIT.zh
    return {
      id: feature.id,
      feature,
      title,
      content: text.length > limit ? text.substring(0, limit) + '......' : text,
      // 列表用小圖；沒有圖時給空字串，元件會改顯示預設圖（icon.others.noImage）
      imgSrc: coverThumb ?? coverImage ?? '',
      link: pageUrl,
    }
  }

  getDetailByFeature(feature: SceneFeature): DetailArticleType {
    const { coverThumb, coverImage, pageUrl, contributors } = feature.properties
    const title = this.pickTitle(feature)
    return {
      title,
      subtitle: title,
      content: this.pickContent(feature).text,
      contentHtml: toSceneContentHtml(this.pickBody(feature)),
      imgSrc: coverImage ?? coverThumb ?? '',
      link: pageUrl,
      // 沒有撰稿者時仍保留「撰稿者：」前綴，卡片才不會只剩孤零零的「未知」
      ref: `撰稿者：${contributors?.trim() || '未知'}`,
    }
  }

  /** 順序就是 API 回傳的順序（後端已排好），不再依 title 前綴重排。 */
  async getAll(
    _refresh?: boolean,
    language?: string,
  ): Promise<SummaryArticleType[]> {
    this.setLanguage(language)
    const features = await this.getFeatures()
    return features.map((feature) => this.getSummaryByFeature(feature))
  }
}

export default StrapiArticleParser
