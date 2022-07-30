export interface IArticleProxyParser {
    getDetailByTitle: (title: string, fallbackUrl?: string | null) => Promise<DetailArticleType>;
    getAll: (refresh?: boolean) => Promise<SummaryArticleType[]>;
}
export declare type ArticleExternalProps = {
    content: string;
    subtitle: string;
    ref: string;
};
export declare type SummaryArticleType = {
    title: string;
    content: string;
    imgSrc: string;
    link: string;
};
export declare type Article = SummaryArticleType & Partial<ArticleExternalProps>;
export declare type DetailArticleType = SummaryArticleType & ArticleExternalProps;
