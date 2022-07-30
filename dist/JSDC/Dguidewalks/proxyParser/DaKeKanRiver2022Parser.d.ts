import ArticleProxyParser from '.';
import { SummaryArticleType } from './@types';
import { AbsctractArticleProxyParserContructor } from './AbsctractArticleProxyParser';
declare class DaKeKanRiver2022Parser extends ArticleProxyParser {
    anchorId: string;
    constructor(anchorId: string, options: AbsctractArticleProxyParserContructor);
    getArticlesFromHTML(dom: Document): SummaryArticleType[];
}
export default DaKeKanRiver2022Parser;
