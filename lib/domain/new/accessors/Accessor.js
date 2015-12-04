var Accessor = (function () {
    function Accessor(key, urlString) {
        this.key = key;
        this.urlKey = urlString || key && key.replace(/\./g, "_");
    }
    Accessor.prototype.setSearcher = function (searcher) {
        this.searcher = searcher;
    };
    Accessor.prototype.getResults = function () {
        return this.searcher.results;
    };
    Accessor.prototype.buildSharedQuery = function (query) {
        return query;
    };
    Accessor.prototype.buildOwnQuery = function (query) {
        return query;
    };
    return Accessor;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Accessor;
//# sourceMappingURL=Accessor.js.map