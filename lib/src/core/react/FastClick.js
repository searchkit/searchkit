var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var FastClick = (function (_super) {
    __extends(FastClick, _super);
    function FastClick() {
        _super.apply(this, arguments);
        this.threshold = 20;
    }
    FastClick.prototype.handleMouseDown = function (event) {
        if (this.supportsTouch)
            return;
        if (event.button === 0) {
            this.props.handler();
        }
    };
    FastClick.prototype.cleanupTouch = function () {
        delete this.startPoint;
    };
    FastClick.prototype.getSinglePoint = function (event) {
        var touches = event.changedTouches;
        if (touches.length === 1) {
            return {
                x: touches[0].pageX,
                y: touches[0].pageY
            };
        }
        return null;
    };
    FastClick.prototype.handleTouchStart = function (event) {
        this.supportsTouch = true;
        this.startPoint = this.getSinglePoint(event);
    };
    FastClick.prototype.pointsWithinThreshold = function (p1, p2) {
        return (Math.abs(p1.x - p2.x) < this.threshold &&
            Math.abs(p1.y - p2.y) < this.threshold);
    };
    FastClick.prototype.handleTouchEnd = function (event) {
        if (this.startPoint) {
            var endPoint = this.getSinglePoint(event);
            if (this.pointsWithinThreshold(this.startPoint, endPoint)) {
                this.props.handler();
            }
            delete this.startPoint;
        }
    };
    FastClick.prototype.render = function () {
        return React.cloneElement(this.props.children, {
            onMouseDown: this.handleMouseDown.bind(this),
            onTouchStart: this.handleTouchStart.bind(this),
            onTouchEnd: this.handleTouchEnd.bind(this)
        });
    };
    return FastClick;
})(React.Component);
exports.FastClick = FastClick;
//# sourceMappingURL=FastClick.js.map