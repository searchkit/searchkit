var support_1 = require("../support");
var Accessor = (function () {
    function Accessor() {
        this.uuid = support_1.Utils.guid();
        this.active = true;
        this.translations = {};
    }
    Accessor.prototype.setActive = function (active) {
        this.active = active;
        return this;
    };
    Accessor.prototype.setSearchkitManager = function (searchkit) {
        this.searchkit = searchkit;
    };
    Accessor.prototype.translate = function (key) {
        return ((this.searchkit && this.searchkit.translate(key)) ||
            this.translations[key] ||
            key);
    };
    Accessor.prototype.getResults = function () {
        return this.results;
    };
    Accessor.prototype.setResults = function (results) {
        this.results = results;
    };
    Accessor.prototype.getAggregations = function (path, defaultValue) {
        var results = this.getResults();
        var getPath = ['aggregations'].concat(path);
        return _.get(results, getPath, defaultValue);
    };
    Accessor.prototype.buildSharedQuery = function (query) {
        return query;
    };
    Accessor.prototype.buildOwnQuery = function (query) {
        return query;
    };
    return Accessor;
})();
exports.Accessor = Accessor;
//# sourceMappingURL=Accessor.js.map