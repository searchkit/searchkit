var ReactTestUtils = require('react-addons-test-utils');
var beautifyHtml = require('js-beautify').html;
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
exports.jsxToHTML = require('react-dom/server').renderToStaticMarkup;
exports.printPrettyHtml = function (html) {
    console.log("\n" + beautifyHtml(html, { "indent_size": 2 }).replace(/class=/g, "className="));
};
exports.fastClick = function (el) {
    el.simulate("mouseDown", { button: 0 });
};
//# sourceMappingURL=TestHelpers.js.map