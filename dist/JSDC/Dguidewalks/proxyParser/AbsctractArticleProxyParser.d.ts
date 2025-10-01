import { ArticleExternalProps, DetailArticleType, SummaryArticleType } from './@types';
export declare type AbsctractArticleProxyParserContructor = {
    proxyFetcher: (url: string) => Promise<string>;
    cmsPath: string;
    apiUrls?: string[];
};
declare class ArticleCache {
    summaryMap: {
        [k: string]: SummaryArticleType;
    };
    externalMap: {
        [k: string]: ArticleExternalProps;
    };
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
    constructor(options: AbsctractArticleProxyParserContructor);
    get url(): string;
    parseHTML(htmlString: string): Document;
    isArticleDetailComplete(detail: DetailArticleType): string;
}
export default AbsctractArticleProxyParser;
