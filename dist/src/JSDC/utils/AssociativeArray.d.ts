export default class AssociativeArray<T> {
    values: Array<T>;
    private _hash;
    gets(keys: string[]): T[];
    omit(keys: string[]): T[];
    get(key: string): T;
    set(key: string, value: T): void;
    remove(key: string): void;
    removeAll(): void;
    contain(key: string): boolean;
}
