var axios = require("axios");
var _ = require("lodash");
var ESTransport = (function () {
    function ESTransport(host, options) {
        if (options === void 0) { options = {}; }
        this.host = host;
        this.options = _.defaults(options, {
            headers: {}
        });
        if (this.options.basicAuth) {
            this.options.headers["Authorization"] = ("Basic " + btoa(this.options.basicAuth));
        }
        this.axios = axios.create({
            baseURL: this.host,
            timeout: ESTransport.timeout,
            headers: this.options.headers
        });
    }
    ESTransport.prototype.search = function (query) {
        console.log(this.axios);
        return this.axios.post("/_search", query)
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