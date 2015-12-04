var Accessor = (function () {
    function Accessor(key, urlString) {
        this.key = key;
        this.urlKey = urlString || key && key.replace(/\./g, "_");
    }
    Accessor.prototype.setSearcher = function (searcher) {
        this.searcher = searcher;
    };
    Accessor.prototype.onStateChange = function (oldState) {
    };
    Accessor.prototype.getResults = function () {
        return this.searcher.results;
    };
    Accessor.prototype.resetState = function () {
        this.state.clear();
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