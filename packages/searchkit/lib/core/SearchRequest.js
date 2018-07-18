Object.defineProperty(exports, "__esModule", { value: true });
var SearchRequest = /** @class */ (function () {
    function SearchRequest(transport, query, searchkit) {
        this.transport = transport;
        this.query = query;
        this.searchkit = searchkit;
        this.active = true;
    }
    SearchRequest.prototype.run = function () {
        return this.transport.search(this.query).then(this.setResults.bind(this)).catch(this.setError.bind(this));
    };
    SearchRequest.prototype.deactivate = function () {
        this.active = false;
    };
    SearchRequest.prototype.setResults = function (results) {
        if (this.active) {
            this.searchkit.setResults(results);
        }
    };
    SearchRequest.prototype.setError = function (error) {
        if (this.active) {
            this.searchkit.setError(error);
        }
    };
    return SearchRequest;
}());
exports.SearchRequest = SearchRequest;
//# sourceMappingURL=SearchRequest.js.map