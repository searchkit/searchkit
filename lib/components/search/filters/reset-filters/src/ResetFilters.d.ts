import { SearchkitComponent } from "../../../../../core";
export declare class ResetFilters extends SearchkitComponent<any, any> {
    defineBEMBlocks(): {
        container: any;
    };
    hasFilters(): boolean;
    resetFilters(): void;
    renderResetButton(): JSX.Element;
    render(): JSX.Element;
}
