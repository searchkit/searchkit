// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/joemcelroy/DefinitelyTyped/8cd79728efa7652d934b2703feeb68bb4802aebb/react/react-addons-update.d.ts
// Type definitions for React v0.14 (react-addons-update)
// Project: http://facebook.github.io/react/
// Definitions by: Asana <https://asana.com>, AssureSign <http://www.assuresign.com>, Microsoft <https://microsoft.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare namespace __React {
    interface UpdateSpecCommand {
        $set?: any;
        $merge?: {};
        $apply?(value: any): any;
    }

    interface UpdateSpecPath {
        [key: string]: UpdateSpec;
    }

    type UpdateSpec = UpdateSpecCommand | UpdateSpecPath;

    interface UpdateArraySpec extends UpdateSpecCommand {
        $push?: any[];
        $unshift?: any[];
        $splice?: any[][];
    }

    namespace __Addons {
        export function update(value: any[], spec: UpdateArraySpec): any[];
        export function update(value: {}, spec: UpdateSpec): any;
    }
}

declare module "react-addons-update" {
    export = __React.__Addons.update;
}