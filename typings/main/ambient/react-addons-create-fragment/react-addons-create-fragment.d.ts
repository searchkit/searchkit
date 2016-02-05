// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/joemcelroy/DefinitelyTyped/8cd79728efa7652d934b2703feeb68bb4802aebb/react/react-addons-create-fragment.d.ts
// Type definitions for React v0.14 (react-addons-create-fragment)
// Project: http://facebook.github.io/react/
// Definitions by: Asana <https://asana.com>, AssureSign <http://www.assuresign.com>, Microsoft <https://microsoft.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare namespace __React {
    namespace __Addons {
        export function createFragment(object: { [key: string]: ReactNode }): ReactFragment;
    }
}

declare module "react-addons-create-fragment" {
    export = __React.__Addons.createFragment;
}