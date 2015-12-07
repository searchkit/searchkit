export declare class ESRequest {
    index: string;
    constructor(index: string);
    searchUrl(): string;
    search(query: any): Promise<{}>;
}
