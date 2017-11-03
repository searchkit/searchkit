import { ImmutableQuery } from "searchkit";
export interface SuggestGroup {
    title: String;
    results: Array<Object>;
}
export declare type Source = DataSource | SearchkitDatasource;
export interface DataSource {
    isSearchkitSource(): boolean;
    search(queryString: String): Promise<Array<SuggestGroup>>;
}
export interface SearchkitDatasource {
    isSearchkitSource(): boolean;
    search(query: ImmutableQuery, queryString: String): ImmutableQuery;
}
