Object.defineProperty(exports, "__esModule", { value: true });
var support_1 = require("../support");
var get = require("lodash/get");
var compact = require("lodash/compact");
var Accessor = /** @class */ (function () {
    function Accessor() {
        this.active = true;
        this.translations = {};
        this.refCount = 0;
    }
    Accessor.prototype.incrementRef = function () {
        this.refCount++;
    };
    Accessor.prototype.decrementRef = function () {
        this.refCount--;
    };
    Accessor.prototype.setActive = function (active) {
        this.active = active;
        return this;
    };
    Accessor.prototype.setSearchkitManager = function (searchkit) {
        this.searchkit = searchkit;
        this.uuid = searchkit.guid();
        this.results = this.searchkit.results;
    };
    Accessor.prototype.translate = function (key, interpolations) {
        var translation = ((this.searchkit && this.searchkit.translate(key)) ||
            this.translations[key] ||
            key);
        return support_1.Utils.translate(translation, interpolations);
    };
    Accessor.prototype.getResults = function () {
        return this.results;
    };
    Accessor.prototype.setResults = function (results) {
        this.results = results;
    };
    Accessor.prototype.getAggregations = function (path, defaultValue) {
        var results = this.getResults();
        var getPath = compact(['aggregations'].concat(path));
        return get(results, getPath, defaultValue);
    };
    Accessor.prototype.beforeBuildQuery = function () {
    };
    Accessor.prototype.buildSharedQuery = function (query) {
        return query;
    };
    Accessor.prototype.buildOwnQuery = function (query) {
        return query;
    };
    return Accessor;
}());
exports.Accessor = Accessor;
//# sourceMappingURL=Accessor.js.map