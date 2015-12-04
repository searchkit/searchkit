export default class ESRequest {
    index: string;
    constructor(index: string);
    searchUrl(): string;
    search(queries: any): Promise<{}>;
}
