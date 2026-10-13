export type ConfigProviderOptions = {
    sceneApiUrl?: string;
    eventId: string;
    cmsPath?: string[];
};
export default class ConfigProvider {
    /** Strapi API 的 base，結尾帶 `/`。景點、底圖、線、面都從這裡的 `walks/{eventId}` 來。 */
    readonly sceneApiUrl: string;
    readonly eventId: string;
    readonly cmsPath?: string[];
    constructor(options: ConfigProviderOptions);
}
