import * as axios from "axios";
export declare class ESRequest {
    host: string;
    constructor(host: string);
    searchUrl(): string;
    search(query: any): axios.Promise;
}
