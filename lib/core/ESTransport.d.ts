import * as axios from "axios";
export declare class ESTransport {
    host: string;
    static timeout: number;
    axios: axios.AxiosInstance;
    constructor(host: string);
    _search(query: any): axios.Promise;
    _msearch(queries: any): axios.Promise;
    search(queries: any): axios.Promise;
    getData(response: any): any;
}
