// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/joemcelroy/DefinitelyTyped/8cd79728efa7652d934b2703feeb68bb4802aebb/react/react-addons-css-transition-group.d.ts
// Type definitions for React v0.14 (react-addons-css-transition-group)
// Project: http://facebook.github.io/react/
// Definitions by: Asana <https://asana.com>, AssureSign <http://www.assuresign.com>, Microsoft <https://microsoft.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare namespace __React {
    interface CSSTransitionGroupTransitionName {
        enter: string;
        enterActive?: string;
        leave: string;
        leaveActive?: string;
        appear?: string;
        appearActive?: string;
    }

    interface CSSTransitionGroupProps extends TransitionGroupProps {
        transitionName: string | CSSTransitionGroupTransitionName;
        transitionAppear?: boolean;
        transitionAppearTimeout?: number;
        transitionEnter?: boolean;
        transitionEnterTimeout?: number;
        transitionLeave?: boolean;
        transitionLeaveTimeout?: number;
    }

    type CSSTransitionGroup = ComponentClass<CSSTransitionGroupProps>;

    namespace __Addons {
        export var CSSTransitionGroup: __React.CSSTransitionGroup;
    }
}

declare module "react-addons-css-transition-group" {
    var CSSTransitionGroup: __React.CSSTransitionGroup;
    type CSSTransitionGroup = __React.CSSTransitionGroup;
    export = CSSTransitionGroup;
}