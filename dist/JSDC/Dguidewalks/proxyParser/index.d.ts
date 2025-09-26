import { SummaryArticleType, IArticleProxyParser } from './@types';
import AbsctractArticleProxyParser, { AbsctractArticleProxyParserContructor } from './AbsctractArticleProxyParser';
declare class ArticleProxyParser extends AbsctractArticleProxyParser implements IArticleProxyParser {
    constructor(options: AbsctractArticleProxyParserContructor);
    getAll(refresh?: boolean | undefined): Promise<SummaryArticleType[]>;
    getDetailByTitle(title: string, fallbackUrl?: string | null | undefined): Promise<{
        content: string;
        subtitle: string;
        ref: string;
        title: string;
        imgSrc: string;
        link: string;
    }>;
    getArticlesFromHTML(dom: Document): SummaryArticleType[];
    getArticlesFromAPI(): Promise<SummaryArticleType[]>;
    getExternalDetailFromHTML(dom: Document): {
        subtitle: string;
        ref: string;
        content: string;
    };
    getExternalDetailFromAPI(title: string): Promise<{
        subtitle: string;
        ref: string;
        content: string;
    }>;
}
export default ArticleProxyParser;
