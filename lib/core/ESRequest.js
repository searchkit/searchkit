var axios = require("axios");
var ESRequest = (function () {
    function ESRequest(host) {
        this.host = host;
    }
    ESRequest.prototype.searchUrl = function () {
        return this.host + "/_search";
    };
    ESRequest.prototype.search = function (query) {
        return axios.post(this.searchUrl(), query)
            .then(function (response) {
            return response.data;
        });
    };
    return ESRequest;
})();
exports.ESRequest = ESRequest;
//# sourceMappingURL=ESRequest.js.map