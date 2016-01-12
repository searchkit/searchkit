import * as axios from "axios";
import { ESTransport } from "./ESTransport";
export interface ESTransportOptions {
    headers?: Object;
    basicAuth?: string;
}
export declare class AxiosESTransport extends ESTransport {
    host: string;
    static timeout: number;
    axios: axios.AxiosInstance;
    options: ESTransportOptions;
    constructor(host: string, options?: ESTransportOptions);
    search(query: Object): axios.Promise;
    getData(response: any): any;
}
