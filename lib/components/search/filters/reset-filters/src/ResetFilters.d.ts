import SearchkitComponent from "../../../../SearchkitComponent";
export default class ResetFilters extends SearchkitComponent<any, any> {
    hasFilters(): boolean;
    resetFilters(): void;
    renderResetButton(): JSX.Element;
    render(): JSX.Element;
}
