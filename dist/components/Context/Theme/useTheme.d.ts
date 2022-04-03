export declare const defaultStyle: {
    '--rui-primary': string;
    '--rui-secondary': string;
    '--rui-accent': string;
    '--rui-bg-primary': string;
    '--rui-bg-secondary': string;
    '--rui-bg-accent': string;
    '--rui-text-primary': string;
    '--rui-text-gray': string;
};
export declare type StyleType = Partial<typeof defaultStyle & {
    [k: string]: string;
}>;
declare const useTheme: (style: StyleType) => void;
export default useTheme;
