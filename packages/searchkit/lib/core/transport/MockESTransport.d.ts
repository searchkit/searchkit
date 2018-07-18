import { ESTransport } from "./ESTransport";
export declare class MockESTransport extends ESTransport {
    search(query: any): Promise<any>;
}
