import * as Rx from "rx";
import { SearchkitComponent } from "./SearchkitComponent";
export interface LoadingProps {
    children?: any;
}
export declare class LoadingComponent extends SearchkitComponent<LoadingProps, any> {
    loadingUnsubscribe: Rx.IDisposable;
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): any;
}
