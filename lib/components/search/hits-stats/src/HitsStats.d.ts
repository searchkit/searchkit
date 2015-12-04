import { SearchkitComponent } from "../../../../core";
export interface IHitsStats {
}
export declare class HitsStats extends SearchkitComponent<IHitsStats, any> {
    getHitCount(): number;
    render(): JSX.Element;
}
