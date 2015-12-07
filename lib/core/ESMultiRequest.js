var axios = require("axios");
var ESMultiRequest = (function () {
    function ESMultiRequest() {
    }
    ESMultiRequest.prototype.searchUrl = function () {
        return "/api/multisearch";
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