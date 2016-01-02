import { SearchkitComponent } from "../../../../core";
export interface IHitsStats {
    mod?: string;
}
export declare class HitsStats extends SearchkitComponent<IHitsStats, any> {
    defineBEMBlocks(): {
        container: string;
    };
    getHits(): {};
    getHitCount(): number;
    renderText(): JSX.Element;
    render(): JSX.Element;
}
