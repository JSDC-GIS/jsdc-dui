export declare type ConfigProviderOptions = {
    baseApiUrl?: string;
    eventId: string;
};
export default class ConfigProvider {
    readonly baseApiUrl: string;
    readonly eventId: string;
    constructor(options: ConfigProviderOptions);
}
