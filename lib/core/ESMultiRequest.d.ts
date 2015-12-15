import * as axios from "axios";
export declare class ESMultiRequest {
    host: string;
    constructor(host: string);
    searchUrl(): string;
    search(queries: any): axios.Promise;
}
