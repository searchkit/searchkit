var axios = require("axios");
var ESRequest = (function () {
    function ESRequest(index) {
        this.index = index;
    }
    ESRequest.prototype.searchUrl = function () {
        return "/api/multisearch/" + this.index;
    };
    ESRequest.prototype.search = function (queries) {
        return axios.post(this.searchUrl(), queries)
            .then(function (response) {
            return response.data;
        });
    };
    return ESRequest;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESRequest;
//# sourceMappingURL=ESRequest.js.map