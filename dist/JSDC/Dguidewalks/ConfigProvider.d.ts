export type ConfigProviderOptions = {
    baseApiUrl?: string;
    eventId: string;
    cmsPath?: string[];
};
export default class ConfigProvider {
    readonly baseApiUrl: string;
    readonly eventId: string;
    readonly cmsPath?: string[];
    constructor(options: ConfigProviderOptions);
}
