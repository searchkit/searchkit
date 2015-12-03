var Accessor = (function () {
    function Accessor(key, options) {
        if (options === void 0) { options = {}; }
        this.key = key;
        this.options = options;
    }
    Accessor.prototype.searchReset = function () {
    };
    Accessor.prototype.buildQuery = function (builder) {
        var stateValues = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            stateValues[_i - 1] = arguments[_i];
        }
    };
    Accessor.prototype.buildPostQuery = function (builder) {
        var stateValues = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            stateValues[_i - 1] = arguments[_i];
        }
    };
    Accessor.prototype.setSearcher = function (searcher) {
        this.searcher = searcher;
    };
    Accessor.prototype.setState = function (state) {
        this.state = state;
    };
    Accessor.prototype.search = function () {
        this.searcher.stateManager.updateHistory();
    };
    Accessor.prototype.triggerSearchReset = function () {
        this.searcher.stateManager.searchReset();
    };
    Accessor.prototype.findAccessorsByClass = function (accessorClass) {
        return this.searcher.stateManager.findAccessorsByClass(accessorClass);
    };
    Accessor.prototype.getResults = function () {
        return this.searcher.results;
    };
    return Accessor;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Accessor;
//# sourceMappingURL=Accessor.js.map