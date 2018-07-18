var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var RenderComponent_1 = require("./RenderComponent");
var NormalClickComponent = /** @class */ (function (_super) {
    __extends(NormalClickComponent, _super);
    function NormalClickComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NormalClickComponent.prototype.render = function () {
        return React.cloneElement(this.props.children, {
            onClick: this.props.handler
        });
    };
    return NormalClickComponent;
}(React.PureComponent));
exports.NormalClickComponent = NormalClickComponent;
var FastClickComponent = /** @class */ (function (_super) {
    __extends(FastClickComponent, _super);
    function FastClickComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.threshold = 20;
        return _this;
    }
    FastClickComponent.prototype.handleMouseDown = function (event) {
        if (this.supportsTouch)
            return;
        if (event.button === 0) {
            this.props.handler();
        }
    };
    FastClickComponent.prototype.cleanupTouch = function () {
        delete this.startPoint;
    };
    FastClickComponent.prototype.getSinglePoint = function (event) {
        var touches = event.changedTouches;
        if (touches.length === 1) {
            return {
                x: touches[0].pageX,
                y: touches[0].pageY
            };
        }
        return null;
    };
    FastClickComponent.prototype.handleTouchStart = function (event) {
        this.supportsTouch = true;
        this.startPoint = this.getSinglePoint(event);
    };
    FastClickComponent.prototype.pointsWithinThreshold = function (p1, p2) {
        return (Math.abs(p1.x - p2.x) < this.threshold &&
            Math.abs(p1.y - p2.y) < this.threshold);
    };
    FastClickComponent.prototype.handleTouchEnd = function (event) {
        if (this.startPoint) {
            var endPoint = this.getSinglePoint(event);
            if (this.pointsWithinThreshold(this.startPoint, endPoint)) {
                this.props.handler();
            }
            this.cleanupTouch();
        }
    };
    FastClickComponent.prototype.handleClick = function (event) {
        event.preventDefault();
    };
    FastClickComponent.prototype.render = function () {
        return React.cloneElement(this.props.children, {
            onMouseDown: this.handleMouseDown.bind(this),
            onTouchStart: this.handleTouchStart.bind(this),
            onTouchEnd: this.handleTouchEnd.bind(this),
            onClick: this.handleClick.bind(this)
        });
    };
    return FastClickComponent;
}(React.PureComponent));
exports.FastClickComponent = FastClickComponent;
var FastClick = /** @class */ (function (_super) {
    __extends(FastClick, _super);
    function FastClick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FastClick.prototype.render = function () {
        return RenderComponent_1.renderComponent(FastClick.component, this.props, this.props.children);
    };
    FastClick.component = NormalClickComponent;
    return FastClick;
}(React.Component));
exports.FastClick = FastClick;
//# sourceMappingURL=FastClick.js.map