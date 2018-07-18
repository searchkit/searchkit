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
var StatefulAccessor_1 = require("./StatefulAccessor");
var state_1 = require("../state");
var PageSizeAccessor = /** @class */ (function (_super) {
    __extends(PageSizeAccessor, _super);
    function PageSizeAccessor(defaultSize) {
        var _this = _super.call(this, "size") || this;
        _this.defaultSize = defaultSize;
        _this.state = new state_1.ValueState();
        return _this;
    }
    PageSizeAccessor.prototype.setSize = function (size) {
        if (this.defaultSize == size) {
            this.state = this.state.clear();
        }
        else {
            this.state = this.state.setValue(size);
        }
    };
    PageSizeAccessor.prototype.getSize = function () {
        return Number(this.state.getValue() || this.defaultSize);
    };
    PageSizeAccessor.prototype.buildSharedQuery = function (query) {
        return query.setSize(this.getSize());
    };
    return PageSizeAccessor;
}(StatefulAccessor_1.StatefulAccessor));
exports.PageSizeAccessor = PageSizeAccessor;
//# sourceMappingURL=PageSizeAccessor.js.map