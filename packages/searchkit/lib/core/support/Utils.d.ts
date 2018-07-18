export declare class Utils {
    static guidCounter: number;
    static guid(prefix?: string): string;
    static collapse(collection: any, seed: any): any;
    static instanceOf(klass: any): (val: any) => boolean;
    static interpolate(str: any, interpolations: any): any;
    static translate(key: any, interpolations?: any): any;
    static computeOptionKeys(options: any, fields: any, defaultKey: any): any;
    static generateKeyFromFields(ob: any, fields: any, defaultKey: any): any;
}
