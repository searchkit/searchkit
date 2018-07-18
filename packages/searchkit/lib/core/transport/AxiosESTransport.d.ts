import { AxiosInstance, AxiosResponse } from "axios";
import { ESTransport } from "./ESTransport";
export interface ESTransportOptions {
    headers?: Object;
    basicAuth?: string;
    withCredentials?: boolean;
    searchUrlPath?: string;
    timeout?: number;
}
export declare class AxiosESTransport extends ESTransport {
    host: string;
    static timeout: number;
    axios: AxiosInstance;
    options: ESTransportOptions;
    constructor(host: string, options?: ESTransportOptions);
    search(query: Object): Promise<AxiosResponse>;
    getData(response: any): any;
    private static parseCredentials(options);
}
