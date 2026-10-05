import ArticleProxyParser from '.';
import { SummaryArticleType } from './@types';
import { AbsctractArticleProxyParserContructor } from './AbsctractArticleProxyParser';
/** @deprecated 舊的 Drupal 來源，見 `ArticleProxyParser`。 */
declare class DaKeKanRiver2022Parser extends ArticleProxyParser {
    anchorId: string;
    constructor(anchorId: string, options: AbsctractArticleProxyParserContructor);
    getArticlesFromHTML(dom: Document): SummaryArticleType[];
}
export default DaKeKanRiver2022Parser;
