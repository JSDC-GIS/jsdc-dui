export declare const defaultStyle: {
    '--dui-primary': string;
    '--dui-secondary': string;
    '--dui-accent': string;
    '--dui-bg-primary': string;
    '--dui-bg-secondary': string;
    '--dui-bg-accent': string;
    '--dui-text-primary': string;
    '--dui-text-gray': string;
};
export declare type StyleType = Partial<typeof defaultStyle & {
    [k: string]: string;
}>;
declare const useTheme: (style: StyleType) => void;
export default useTheme;
