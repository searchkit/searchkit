import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface HitsStatsProps extends SearchkitComponentProps {
}
export declare class HitsStats extends SearchkitComponent<HitsStatsProps, any> {
    static translations: any;
    translations: any;
    static propTypes: {};
    defineBEMBlocks(): {
        container: string;
    };
    getHitCount(): number;
    getTime(): number;
    renderText(): JSX.Element;
    render(): JSX.Element;
}
