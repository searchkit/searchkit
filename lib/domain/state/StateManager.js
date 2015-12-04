var _ = require("lodash");
var update = require("react-addons-update");
var querystring = require("querystring");
var history_1 = require("../history");
var StateMap_1 = require("./StateMap");
var RootBuilder_1 = require("../builders/RootBuilder");
var StateAcessors = (function () {
    function StateAcessors(searcher) {
        this.searcher = searcher;
        this.state = new StateMap_1.default();
        this.stateAccessors = [];
    }
    StateAcessors.prototype.registerAccessor = function (accessor) {
        accessor.setSearcher(this.searcher);
        accessor.setState(this.state.boundStateMap(accessor.key));
        this.stateAccessors.push(accessor);
        return accessor;
    };
    StateAcessors.prototype.findAccessorsByClass = function (accessorClass) {
        return _.filter(this.stateAccessors, function (accessor) {
            return accessor instanceof accessorClass;
        });
    };
    StateAcessors.prototype.invokeAccessors = function (method) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        _.each(this.stateAccessors, function (accessor) {
            var stateArgs = _this.state.get(accessor.key) || [];
            accessor[method].apply(accessor, args.concat(stateArgs));
        });
    };
    StateAcessors.prototype.searchReset = function () {
        _.invoke(this.stateAccessors, "searchReset");
    };
    StateAcessors.prototype.getData = function () {
        var data = new RootBuilder_1.default();
        this.invokeAccessors("buildQuery", data);
        this.invokeAccessors("buildPostQuery", data);
        return data;
    };
    StateAcessors.prototype.updateHistory = function () {
        history_1.default.pushState(null, window.location.pathname, this.state.getState());
    };
    return StateAcessors;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StateAcessors;
//# sourceMappingURL=StateManager.js.map