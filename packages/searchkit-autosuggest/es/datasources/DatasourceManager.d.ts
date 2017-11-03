import { SearchkitDatasourceManager } from "./SearchkitDatasourceManager";
import { SearchkitManager } from "searchkit";
import { Source, DataSource, SuggestGroup } from "./Types";
export declare class DatasourceManager {
    searchkit: SearchkitManager;
    sources: Array<DataSource>;
    searchkitDatasource: SearchkitDatasourceManager;
    constructor(searchkit: any, sources?: Array<Source>);
    search(query: any): Promise<Array<SuggestGroup>>;
}
