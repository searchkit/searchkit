var support_1 = require("../support");
var StatelessAccessor = (function () {
    function StatelessAccessor(key, urlString) {
        this.uuid = support_1.Utils.guid();
    }
    StatelessAccessor.prototype.setSearcher = function (searcher) {
        this.searcher = searcher;
    };
    StatelessAccessor.prototype.translate = function (key) {
        return this.searcher.translate(key);
    };
    StatelessAccessor.prototype.getResults = function () {
        return this.searcher.results;
    };
    StatelessAccessor.prototype.getAggregations = function (path, defaultValue) {
        var results = this.getResults();
        var getPath = ['aggregations'].concat(path);
        return _.get(results, getPath, defaultValue);
    };
    StatelessAccessor.prototype.buildSharedQuery = function (query) {
        return query;
    };
    StatelessAccessor.prototype.buildOwnQuery = function (query) {
        return query;
    };
    return StatelessAccessor;
})();
exports.StatelessAccessor = StatelessAccessor;
//# sourceMappingURL=StatelessAccessor.js.map