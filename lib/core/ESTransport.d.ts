import * as axios from "axios";
export declare class ESTransport {
    host: string;
    static timeout: number;
    axios: axios.AxiosInstance;
    constructor(host: string);
    search(query: any): axios.Promise;
    msearch(queries: any): axios.Promise;
    getData(response: any): any;
}
