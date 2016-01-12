var support_1 = require("../support");
var Accessor = (function () {
    function Accessor() {
        this.uuid = support_1.Utils.guid();
    }
    Accessor.prototype.setSearcher = function (searcher) {
        this.searcher = searcher;
    };
    Accessor.prototype.translate = function (key) {
        return this.searcher.translate(key);
    };
    Accessor.prototype.getResults = function () {
        return this.searcher.results;
    };
    Accessor.prototype.onNewResults = function () {
    };
    Accessor.prototype.getAggregations = function (path, defaultValue) {
        var results = this.getResults();
        var getPath = ['aggregations'].concat(path);
        return _.get(results, getPath, defaultValue);
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