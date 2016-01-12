import { SearchkitComponent } from "../../../../core";
export interface IHitsStats {
    mod?: string;
}
export declare class HitsStats extends SearchkitComponent<IHitsStats, any> {
    defineBEMBlocks(): {
        container: string;
    };
    getHitCount(): number;
    getTime(): number;
    renderText(): JSX.Element;
    render(): JSX.Element;
}
