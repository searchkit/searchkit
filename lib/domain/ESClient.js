var axios = require("axios");
var rx = require("rx");
var StateManager_1 = require("./state/StateManager");
var ESClient = (function () {
    function ESClient(host, index) {
        var _this = this;
        this.host = host;
        this.index = index;
        this.results = {};
        this.resultsListener = new rx.ReplaySubject(1);
        this.stateManager = new StateManager_1.default(this);
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
    }
    ESClient.prototype.setStateQuery = function (stateQuery) {
        this.stateManager.state.setState(stateQuery);
    };
    ESClient.prototype.searchUrl = function () {
        // return [this.host, this.index, "_search"].join("/")
        return "/api/search/" + this.index;
    };
    ESClient.prototype.getQuery = function () {
        return this.stateManager.getData().getJSON();
    };
    ESClient.prototype.listenToHistory = function (history) {
        var _this = this;
        history.listen(function (location) {
            _this.setStateQuery(location.query);
            _this.search();
        });
    };
    ESClient.prototype.search = function () {
        var _this = this;
        this.registrationCompleted.then(function () {
            var query = _this.getQuery();
            console.log(query);
            return axios.post(_this.searchUrl(), query)
                .then(function (response) {
                _this.results = response.data;
                console.log(_this.results);
                _this.resultsListener.onNext(_this.results);
                return _this.results;
            });
        });
    };
    return ESClient;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESClient;
//# sourceMappingURL=ESClient.js.map