var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Accessor_1 = require("./Accessor");
var StatefulAccessor = (function (_super) {
    __extends(StatefulAccessor, _super);
    function StatefulAccessor(key, urlString) {
        _super.call(this);
        this.key = key;
        this.urlKey = urlString || key && key.replace(/\./g, "_");
    }
    StatefulAccessor.prototype.onStateChange = function (oldState) {
    };
    StatefulAccessor.prototype.fromQueryObject = function (ob) {
        var value = ob[this.urlKey];
        this.state = this.state.setValue(value);
    };
    StatefulAccessor.prototype.getQueryObject = function () {
        var val = this.state.getValue();
        return (val) ? (_a = {},
            _a[this.urlKey] = val,
            _a
        ) : {};
        var _a;
    };
    StatefulAccessor.prototype.setSearchkitManager = function (searchkit) {
        _super.prototype.setSearchkitManager.call(this, searchkit);
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
    return StatefulAccessor;
})(Accessor_1.Accessor);
exports.StatefulAccessor = StatefulAccessor;
//# sourceMappingURL=StatefulAccessor.js.map