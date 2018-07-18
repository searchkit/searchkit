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
var Accessor_1 = require("./Accessor");
var StatefulAccessor = /** @class */ (function (_super) {
    __extends(StatefulAccessor, _super);
    function StatefulAccessor(key, urlString) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.urlKey = urlString || key && key.replace(/\./g, "_");
        _this.urlWithState = _this.urlWithState.bind(_this);
        return _this;
    }
    StatefulAccessor.prototype.onStateChange = function (_oldState) {
    };
    StatefulAccessor.prototype.fromQueryObject = function (ob) {
        var value = ob[this.urlKey];
        this.state = this.state.setValue(value);
    };
    StatefulAccessor.prototype.getQueryObject = function () {
        var val = this.state.getValue();
        return (val) ? (_a = {},
            _a[this.urlKey] = val,
            _a) : {};
        var _a;
    };
    StatefulAccessor.prototype.setSearchkitManager = function (searchkit) {
        _super.prototype.setSearchkitManager.call(this, searchkit);
        this.uuid = this.key + this.uuid;
        this.fromQueryObject(searchkit.state);
        searchkit.query = searchkit.buildQuery();
        this.setResultsState();
    };
    StatefulAccessor.prototype.setResults = function (results) {
        _super.prototype.setResults.call(this, results);
        this.setResultsState();
    };
    StatefulAccessor.prototype.setResultsState = function () {
        this.resultsState = this.state;
    };
    StatefulAccessor.prototype.resetState = function () {
        this.state = this.state.clear();
    };
    StatefulAccessor.prototype.urlWithState = function (state) {
        return this.searchkit.buildSearchUrl((_a = {}, _a[this.urlKey] = state, _a));
        var _a;
    };
    return StatefulAccessor;
}(Accessor_1.Accessor));
exports.StatefulAccessor = StatefulAccessor;
//# sourceMappingURL=StatefulAccessor.js.map