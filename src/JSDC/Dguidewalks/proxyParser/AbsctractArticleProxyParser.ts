import { map } from "lodash";
import {
  ArticleExternalProps,
  DetailArticleType,
  SummaryArticleType,
} from "./@types";

export type AbsctractArticleProxyParserContructor = {
  proxyFetcher: (url: string) => Promise<string>;
  cmsPath: string;
};

class ArticleCache {
  summaryMap: { [k: string]: SummaryArticleType } = {};
  externalMap: { [k: string]: ArticleExternalProps } = {};

  hasArticles() {
    return this.articles.length > 0;
  }
  hasExternalKey(key: string) {
    return !!this.externalMap[key];
  }
  get articles() {
    const remap = map(this.summaryMap, (value, key) => ({
      ...value,
      ...this.externalMap[key],
    }));
    return Object.values(remap);
  }
}

abstract class AbsctractArticleProxyParser {
  proxyFetcher: AbsctractArticleProxyParserContructor["proxyFetcher"];
  cmsPath: AbsctractArticleProxyParserContructor["cmsPath"];
  cache = new ArticleCache();

  constructor(options: AbsctractArticleProxyParserContructor) {
    this.proxyFetcher = options.proxyFetcher;
    this.cmsPath = options.cmsPath;
  }

  get url() {
    const baseCmsUrl = "https://dguidedwalks.tw/";
    return baseCmsUrl + encodeURI(this.cmsPath);
  }

  parseHTML(htmlString: string) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, "text/html");
  }

  isArticleDetailComplete(detail: DetailArticleType) {
    return detail.subtitle && detail.ref && detail.content;
  }
}

export default AbsctractArticleProxyParser;
