var ImmutableQuery_1 = require("./ImmutableQuery");
var Searcher = (function () {
    function Searcher() {
        this.accessors = [];
    }
    Searcher.prototype.addAccessor = function (accessor) {
        this.accessors.push(accessor);
        accessor.setSearcher(this);
    };
    Searcher.prototype.buildQuery = function (query) {
        _.each(this.accessors, function (accessor) {
            query = accessor.buildOwnQuery(query);
        });
        this.queryHasChanged = ImmutableQuery_1.ImmutableQuery.areQueriesDifferent(this.query, query);
        this.query = query;
    };
    Searcher.prototype.getResults = function () {
        return this.results;
    };
    Searcher.prototype.setResults = function (results) {
        this.results = results;
    };
    return Searcher;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Searcher;
//# sourceMappingURL=Searcher.js.map