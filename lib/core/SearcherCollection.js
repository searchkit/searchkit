var _ = require("lodash");
var SearcherCollection = (function () {
    function SearcherCollection(searchers) {
        if (searchers === void 0) { searchers = []; }
        this.searchers = searchers;
    }
    SearcherCollection.prototype.getAccessors = function () {
        return _.chain(this.searchers)
            .pluck("accessors")
            .flatten()
            .value();
    };
    SearcherCollection.prototype.add = function (searcher) {
        this.searchers.push(searcher);
        return searcher;
    };
    SearcherCollection.prototype.size = function () {
        return this.searchers.length;
    };
    SearcherCollection.prototype.getState = function () {
        return _.reduce(this.getAccessors(), function (state, accessor) {
            return _.extend(state, accessor.getQueryObject());
        }, {});
    };
    SearcherCollection.prototype.setAccessorStates = function (query) {
        _.each(this.getAccessors(), function (accessor) { return accessor.fromQueryObject(query); });
    };
    SearcherCollection.prototype.notifyStateChange = function (oldState) {
        _.each(this.getAccessors(), function (accessor) { return accessor.onStateChange(oldState); });
    };
    SearcherCollection.prototype.getChangedSearchers = function () {
        return new SearcherCollection(_.filter(this.searchers, { queryHasChanged: true }));
    };
    SearcherCollection.prototype.buildSharedQuery = function (query) {
        return _.reduce(this.getAccessors(), function (query, accessor) {
            return accessor.buildSharedQuery(query);
        }, query);
    };
    SearcherCollection.prototype.buildQuery = function (query) {
        _.each(this.searchers, function (searcher) { return searcher.buildQuery(query); });
    };
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
        _.each(this.searchers, function (searcher) { return searcher.setError(error); });
    };
    SearcherCollection.prototype.resetState = function () {
        _.each(this.searchers, function (searcher) { return searcher.resetState(); });
    };
    return SearcherCollection;
})();
exports.SearcherCollection = SearcherCollection;
//# sourceMappingURL=SearcherCollection.js.map