var SearcherManager = (function () {
    function SearcherManager() {
        this.searchers = [];
    }
    SearcherManager.prototype.addSearcher = function (searcher) {
        this.searchers.push(searcher);
    };
    SearcherManager.prototype.getAccessors = function () {
        return _.chain(this.searchers)
            .pluck("accessors")
            .flatten()
            .value();
    };
    SearcherManager.prototype.getState = function () {
        return _.reduce(this.getAccessors(), function (state, accessor) {
            return _.extend(state, accessor.getQueryObject());
        }, {});
    };
    SearcherManager.prototype.resetState = function () {
        _.invoke(this.searchers, "resetState");
    };
    SearcherManager.prototype.setAccessorStates = function (query) {
        _.invoke(this.getAccessors(), "fromQueryObject", query);
    };
    SearcherManager.prototype.notifyStateChange = function (oldState) {
        _.invoke(this.getAccessors(), "onStateChange", oldState);
    };
    return SearcherManager;
})();
exports.SearcherManager = SearcherManager;
//# sourceMappingURL=SearcherManager.js.map