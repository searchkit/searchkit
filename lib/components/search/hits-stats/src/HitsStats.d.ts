import SearchkitComponent from "../../../../domain/new/SearchkitComponent";
export interface IHitsStats {
}
export default class HitsStats extends SearchkitComponent<IHitsStats, any> {
    getHitCount(): number;
    render(): JSX.Element;
}
