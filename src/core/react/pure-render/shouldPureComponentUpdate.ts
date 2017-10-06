import {shallowEqualWithoutFunctions} from './shallowEqualWithoutFunctions';

export function shouldPureComponentUpdate(nextProps, nextState, nextContext?) {
  return !shallowEqualWithoutFunctions(this.props, nextProps) ||
         !shallowEqualWithoutFunctions(this.state, nextState);
}
