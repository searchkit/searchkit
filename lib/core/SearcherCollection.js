var _ = require("lodash");
var SearcherCollection = (function () {
    function SearcherCollection(searchers) {
        this.searchers = searchers;
    }
    SearcherCollection.prototype.getQueries = function () {
        return _.map(this.searchers, function (searcher) {
            return searcher.query.getJSON();
        });
    };
    SearcherCollection.prototype.setResponses = function (responses) {
        var _this = this;
        _.each(responses, function (results, index) {
            _this.searchers[index].setResults(results);
        });
    };
    SearcherCollection.prototype.setError = function (error) {
        _.invoke(this.searchers, "setError", error);
    };
    return SearcherCollection;
})();
exports.SearcherCollection = SearcherCollection;
//# sourceMappingURL=SearcherCollection.js.map