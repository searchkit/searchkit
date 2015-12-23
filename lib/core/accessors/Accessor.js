var Accessor = (function () {
    function Accessor(key, urlString) {
        this.key = key;
        this.urlKey = urlString || key && key.replace(/\./g, "_");
    }
    Accessor.prototype.setSearcher = function (searcher) {
        this.searcher = searcher;
        this.setResultsState();
    };
    Accessor.prototype.translate = function (key) {
        return this.searcher.translate(key);
    };
    Accessor.prototype.onStateChange = function (oldState) {
    };
    Accessor.prototype.fromQueryObject = function (ob) {
        var value = ob[this.urlKey];
        this.state = this.state.setValue(value);
    };
    Accessor.prototype.getQueryObject = function () {
        var val = this.state.getValue();
        return (val) ? (_a = {},
            _a[this.urlKey] = this.state.getValue(),
            _a
        ) : {};
        var _a;
    };
    Accessor.prototype.getResults = function () {
        return this.searcher.results;
    };
    Accessor.prototype.setResultsState = function () {
        this.resultsState = this.state;
    };
    Accessor.prototype.resetState = function () {
        this.state = this.state.clear();
    };
    Accessor.prototype.buildSharedQuery = function (query) {
        return query;
    };
    Accessor.prototype.buildOwnQuery = function (query) {
        return query;
    };
    return Accessor;
})();
exports.Accessor = Accessor;
//# sourceMappingURL=Accessor.js.map