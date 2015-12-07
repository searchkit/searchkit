var axios = require("axios");
var ESRequest = (function () {
    function ESRequest(index) {
        this.index = index;
    }
    ESRequest.prototype.searchUrl = function () {
        return "/api/search/" + this.index;
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