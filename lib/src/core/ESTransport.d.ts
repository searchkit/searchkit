import * as axios from "axios";
export interface ESTransportOptions {
    headers?: Object;
    basicAuth?: string;
}
export declare class ESTransport {
    host: string;
    static timeout: number;
    axios: axios.AxiosInstance;
    options: ESTransportOptions;
    constructor(host: string, options?: ESTransportOptions);
    _search(query: any): axios.Promise;
    _msearch(queries: any): axios.Promise;
    search(queries: any): axios.Promise;
    getData(response: any): any;
}
