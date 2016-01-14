import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface HitsStatsProps extends SearchkitComponentProps {
}
export declare class HitsStats extends SearchkitComponent<HitsStatsProps, any> {
    translations: {
        "ResultsFound": string;
    };
    static propTypes: {};
    defineBEMBlocks(): {
        container: string;
    };
    getHitCount(): number;
    getTime(): number;
    renderText(): JSX.Element;
    render(): JSX.Element;
}
