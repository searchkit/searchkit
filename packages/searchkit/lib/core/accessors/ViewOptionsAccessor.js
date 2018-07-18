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
var head = require("lodash/head");
var find = require("lodash/find");
var StatefulAccessor_1 = require("./StatefulAccessor");
var core_1 = require("../../core");
var ViewOptionsAccessor = /** @class */ (function (_super) {
    __extends(ViewOptionsAccessor, _super);
    function ViewOptionsAccessor(key, options) {
        var _this = _super.call(this, key) || this;
        _this.state = new core_1.ValueState();
        _this.options = options;
        return _this;
    }
    ViewOptionsAccessor.prototype.getSelectedOption = function () {
        return find(this.options, { key: this.state.getValue() }) ||
            find(this.options, { defaultOption: true }) ||
            head(this.options);
    };
    ViewOptionsAccessor.prototype.setView = function (key) {
        var view = find(this.options, { key: key });
        if (view) {
            if (view.defaultOption) {
                this.state = this.state.clear();
            }
            else {
                this.state = this.state.setValue(view.key);
            }
            this.search();
        }
    };
    ViewOptionsAccessor.prototype.search = function () {
        //this won't fire search as query didn't change, but it will serialize url
        //might need better way
        this.searchkit.performSearch(false, false);
        this.searchkit.emitter.trigger();
    };
    return ViewOptionsAccessor;
}(StatefulAccessor_1.StatefulAccessor));
exports.ViewOptionsAccessor = ViewOptionsAccessor;
//# sourceMappingURL=ViewOptionsAccessor.js.map