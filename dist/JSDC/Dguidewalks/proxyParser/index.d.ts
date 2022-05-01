export declare type DetailArticleType = {
    title: string;
    subtitle?: string;
    content: string;
    imgSrc: string;
    ref?: string;
    link: string;
};
export declare type DetailArticleInCompleteType = Omit<DetailArticleType, "ref" | "subtitle">;
declare class ArticleProxyParser {
    proxyFetcher: (url: string) => Promise<string>;
    cmsPath: string;
    constructor(options: {
        proxyFetcher: (url: string) => Promise<string>;
        cmsPath: string;
    });
    get url(): string;
    getDetailByTitle(title: string): Promise<DetailArticleType>;
    getAll(refresh?: boolean): Promise<DetailArticleInCompleteType[]>;
}
export default ArticleProxyParser;
