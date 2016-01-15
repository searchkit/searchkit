import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export declare class BaseQueryAccessor extends StatefulAccessor<ValueState> {
    constructor(key: any);
    keepOnlyQueryState(): void;
    setQueryString(queryString: any, withReset?: boolean): void;
    getQueryString(): string | number;
}
