import { SearchkitManager } from "searchkit";
export declare type QuickHitsDatasourceOptions = {
    title: string;
    id: string;
};
export declare class QuickHitsDatasource {
    options: QuickHitsDatasourceOptions;
    searchkit: SearchkitManager;
    constructor(options: any);
    isSearchkitSource(): boolean;
    configure(searchkit: any): void;
    search(query: any, queryString: any): any;
    getGroupedResult(results: any): {
        title: string;
        results: {
            key: any;
            select(): void;
        }[];
    };
}
