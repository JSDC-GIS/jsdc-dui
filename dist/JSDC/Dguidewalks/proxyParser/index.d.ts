import { SummaryArticleType, IArticleProxyParser } from './@types';
import type { SceneFeature } from '../ApiProvider';
import AbsctractArticleProxyParser, { AbsctractArticleProxyParserContructor } from './AbsctractArticleProxyParser';
/** @deprecated 舊的 Drupal JSON:API 來源；預設已改用 `StrapiArticleParser`，不傳 `articleParser` 即可。 */
declare class ArticleProxyParser extends AbsctractArticleProxyParser implements IArticleProxyParser {
    constructor(options: AbsctractArticleProxyParserContructor);
    pickContent(attributes: any): {
        text: string;
        isEnglish: boolean;
    };
    getAll(refresh?: boolean | undefined, language?: string): Promise<SummaryArticleType[]>;
    getDetailByFeature(feature: SceneFeature): Promise<{
        content: string;
        subtitle: string;
        ref: string;
        title: string;
        imgSrc: string;
        link: string;
        id?: string | undefined;
        feature?: SceneFeature | undefined;
    }>;
    getDetailByTitle(title: string, fallbackUrl?: string | null | undefined): Promise<{
        content: string;
        subtitle: string;
        ref: string;
        title: string;
        imgSrc: string;
        link: string;
        id?: string | undefined;
        feature?: SceneFeature | undefined;
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
