var ReactTestUtils = require('react-addons-test-utils');
exports.hasClass = function (inst, className) {
    if (ReactTestUtils.isDOMComponent(inst.node)) {
        return inst.hasClass(className);
    }
    else {
        try {
            var classes = inst.node.props.children.props.className;
            return (' ' + classes + ' ').indexOf(' ' + className + ' ') > -1;
        }
        catch (e) { }
    }
    return false;
};
//# sourceMappingURL=TestHelpers.js.map