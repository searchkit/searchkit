import * as React from "react";
import { SearchkitComponent, SearchkitComponentProps, RenderComponentType } from "../../../../core";
export interface HitsStatsDisplayProps {
    bemBlocks: {
        container: Function;
    };
    resultsFoundLabel: string;
    timeTaken: string | number;
    hitsCount: string | number;
    translate: Function;
}
export interface HitsStatsProps extends SearchkitComponentProps {
    component?: RenderComponentType<HitsStatsDisplayProps>;
    countFormatter?: (count: number) => number | string;
}
export declare class HitsStats extends SearchkitComponent<HitsStatsProps, any> {
    static translations: any;
    translations: any;
    static propTypes: any;
    static defaultProps: {
        component: (props: HitsStatsDisplayProps) => JSX.Element;
        countFormatter: any;
    };
    defineBEMBlocks(): {
        container: string;
    };
    render(): React.ReactElement<any>;
}
