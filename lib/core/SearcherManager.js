var SearcherManager = (function () {
    function SearcherManager() {
        this.searchers = [];
    }
    SearcherManager.prototype.addSearcher = function (searcher) {
        this.searchers.push(searcher);
    };
    return SearcherManager;
})();
exports.SearcherManager = SearcherManager;
//# sourceMappingURL=SearcherManager.js.map