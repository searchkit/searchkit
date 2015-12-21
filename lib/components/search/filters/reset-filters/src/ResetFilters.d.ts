import { SearchkitComponent } from "../../../../../core";
export interface IResetFilters {
    mod?: string;
}
export declare class ResetFilters extends SearchkitComponent<IResetFilters, any> {
    defineBEMBlocks(): {
        container: string;
    };
    hasFilters(): boolean;
    resetFilters(): void;
    renderResetButton(): JSX.Element;
    render(): JSX.Element;
}
