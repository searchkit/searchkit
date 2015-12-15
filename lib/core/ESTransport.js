var axios = require("axios");
var ESTransport = (function () {
    function ESTransport(host) {
        this.host = host;
        this.axios = axios.create({
            baseURL: this.host,
            timeout: ESTransport.timeout,
            headers: {}
        });
    }
    ESTransport.prototype.search = function (query) {
        return this.axios.post("_search", query)
            .then(this.getData);
    };
    ESTransport.prototype.msearch = function (queries) {
        return this.axios.post("_msearch", queries)
            .then(this.getData);
    };
    ESTransport.prototype.getData = function (response) {
        return response.data;
    };
    ESTransport.timeout = 5000;
    return ESTransport;
})();
exports.ESTransport = ESTransport;
//# sourceMappingURL=ESTransport.js.map