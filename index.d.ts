export declare function requireAll(options: RequireOptions | string): Modules;
interface RequireOptions {
    dirname: string;
    excludeDirs?: RegExp | string;
    filter?: filter;
    recursive?: boolean;
    resolve?: (val: any) => any;
    map?: (name: string, path: string) => any;
}
declare type filter = RegExp | ((filename: string) => any);
interface Modules {
    [key: string]: {};
}
export {};
