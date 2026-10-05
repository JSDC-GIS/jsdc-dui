import {
  DetailArticleType,
  IArticleProxyParser,
  SummaryArticleType,
} from './@types'
import { SceneFeature, WalkResponse } from '../ApiProvider'

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

  // 英文沒填（null 或只有空白）的景點退回中文，CMS 大多數景點還沒補英文
  private pickContent(feature: SceneFeature) {
    const { summary, summaryEn } = feature.properties
    const english = summaryEn?.trim()
    if (this.isEnglish && english) return { text: english, isEnglish: true }
    return { text: summary ?? '', isEnglish: false }
  }

  getSummaryByFeature(feature: SceneFeature): SummaryArticleType {
    const { title, coverThumb, coverImage, pageUrl } = feature.properties
    const { text, isEnglish } = this.pickContent(feature)
    const limit = isEnglish ? SUMMARY_LIMIT.en : SUMMARY_LIMIT.zh
    return {
      id: feature.id,
      feature,
      title,
      content: text.length > limit ? text.substring(0, limit) + '......' : text,
      // 列表用小圖；沒有圖時給空字串，<img src=""> 不會發出請求
      imgSrc: coverThumb ?? coverImage ?? '',
      link: pageUrl,
    }
  }

  getDetailByFeature(feature: SceneFeature): DetailArticleType {
    const { title, coverThumb, coverImage, pageUrl, contributors } =
      feature.properties
    return {
      title,
      subtitle: title,
      content: this.pickContent(feature).text,
      imgSrc: coverImage ?? coverThumb ?? '',
      link: pageUrl,
      ref: contributors ? `撰稿者：${contributors}` : '',
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
