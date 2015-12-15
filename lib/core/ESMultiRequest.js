var axios = require("axios");
var ESMultiRequest = (function () {
    function ESMultiRequest(host) {
        this.host = host;
    }
    ESMultiRequest.prototype.searchUrl = function () {
        return this.host + "/_msearch";
    };
    ESMultiRequest.prototype.search = function (queries) {
        return axios.post(this.searchUrl(), queries)
            .then(function (response) {
            return response.data;
        });
    };
    return ESMultiRequest;
})();
exports.ESMultiRequest = ESMultiRequest;
//# sourceMappingURL=ESMultiRequest.js.map