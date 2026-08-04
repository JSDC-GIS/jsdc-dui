import { ArticleExternalProps, DetailArticleType, SummaryArticleType } from './@types';
export type AbsctractArticleProxyParserContructor = {
    proxyFetcher: (url: string) => Promise<string>;
    cmsPath: string[];
    apiUrls?: string[];
};
export declare class ArticleCache {
    summaryMap: {
        [k: string]: SummaryArticleType;
    };
    externalMap: {
        [k: string]: ArticleExternalProps;
    };
    /** 正規化後的 title → summaryMap 的 canonical key */
    normalizedMap: {
        [normalizedKey: string]: string;
    };
    /**
     * 一次建立 summaryMap 與 normalizedMap，兩份索引必須同時寫入才不會走鐘。
     */
    setSummaries(articles: SummaryArticleType[]): void;
    /**
     * 以任意寫法的 title 找出 summaryMap 的 canonical key：
     * 先試字面精確命中，miss 再退到正規化比對（大小寫、空白、換行、全半形）。
     */
    resolveKey(title: string): string | undefined;
    hasArticles(): boolean;
    hasExternalKey(key: string): boolean;
    get articles(): {
        content: string;
        subtitle: string;
        ref: string;
        title: string;
        imgSrc: string;
        link: string;
    }[];
}
declare abstract class AbsctractArticleProxyParser {
    proxyFetcher: AbsctractArticleProxyParserContructor['proxyFetcher'];
    cmsPath: AbsctractArticleProxyParserContructor['cmsPath'];
    apiUrls: string[];
    cache: ArticleCache;
    language: string;
    constructor(options: AbsctractArticleProxyParserContructor);
    get isEnglish(): boolean;
    setLanguage(language?: string): void;
    get url(): string;
    parseHTML(htmlString: string): Document;
    isArticleDetailComplete(detail: DetailArticleType): string;
}
export default AbsctractArticleProxyParser;
