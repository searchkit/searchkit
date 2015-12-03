import SearchkitComponent from "../../../SearchkitComponent.ts";
export interface IHitsStats {
}
export default class HitsStats extends SearchkitComponent<IHitsStats, any> {
    getHitCount(): number;
    render(): JSX.Element;
}
