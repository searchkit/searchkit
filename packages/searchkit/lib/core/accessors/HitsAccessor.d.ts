import { Accessor } from "./Accessor";
export interface HitsOptions {
    scrollTo: string | boolean;
}
export declare class HitsAccessor extends Accessor {
    options: HitsOptions;
    constructor(options: HitsOptions);
    setResults(results: any): void;
    scrollIfNeeded(): void;
    getScrollSelector(): string;
}
