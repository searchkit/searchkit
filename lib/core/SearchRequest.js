var ESTransport_1 = require("./ESTransport");
var SearchRequest = (function () {
    function SearchRequest(host, searchers) {
        this.host = host;
        this.searchers = searchers;
        this.active = true;
        this.transport = new ESTransport_1.ESTransport(host);
    }
    SearchRequest.prototype.run = function () {
        var queries = this.searchers.getQueries();
        console.log("queries", queries);
        if (queries.length > 0) {
            return this.transport.search(queries).then(this.setResponses.bind(this)).catch(this.setError.bind(this));
        }
        return Promise.resolve();
    };
    SearchRequest.prototype.deactivate = function () {
        this.active = false;
    };
    SearchRequest.prototype.setResponses = function (responses) {
        if (this.active) {
            this.searchers.setResponses(responses);
        }
    };
    SearchRequest.prototype.setError = function (error) {
        if (this.active) {
            this.searchers.setError(error);
        }
    };
    return SearchRequest;
})();
exports.SearchRequest = SearchRequest;
//# sourceMappingURL=SearchRequest.js.map