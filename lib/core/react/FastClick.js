var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cloneWithProps = require('react-addons-clone-with-props');
var FastClick = (function (_super) {
    __extends(FastClick, _super);
    function FastClick() {
        _super.apply(this, arguments);
    }
    FastClick.prototype.render = function () {
        var _this = this;
        return cloneWithProps(this.props.children, {
            onMouseDown: function (event) {
                if (event.button === 0) {
                    _this.props.handler();
                }
            }
        });
    };
    return FastClick;
})(React.Component);
exports.FastClick = FastClick;
//# sourceMappingURL=FastClick.js.map