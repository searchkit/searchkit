import { SearchkitComponent } from "../../../../core";
export interface IHitsStats {
    mod?: string;
}
export declare class HitsStats extends SearchkitComponent<IHitsStats, any> {
    defineBEMBlocks(): {
        container: string;
    };
    getHitCount(): number;
    render(): JSX.Element;
}
