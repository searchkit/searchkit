Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var omitBy = require("lodash/omitBy");
var isUndefined = require("lodash/isUndefined");
exports.RenderComponentPropType = PropTypes.oneOfType([
    function (props, propName) {
        if (isUndefined(props[propName]) || (props[propName]["prototype"] instanceof React.Component)) {
            return null;
        }
    },
    PropTypes.element,
    PropTypes.func,
]);
function renderComponent(component, props, children) {
    if (props === void 0) { props = {}; }
    if (children === void 0) { children = null; }
    var isReactComponent = (component["prototype"] instanceof React.Component ||
        (component["prototype"] && component["prototype"].isReactComponent) ||
        typeof component === 'function');
    if (isReactComponent) {
        return React.createElement(component, props, children);
    }
    else if (React.isValidElement(component)) {
        return React.cloneElement(component, omitBy(props, isUndefined), children);
    }
    console.warn("Invalid component", component);
    return null;
}
exports.renderComponent = renderComponent;
//# sourceMappingURL=RenderComponent.js.map