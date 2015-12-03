var _ = require("lodash");
var RootBuilder = (function () {
    function RootBuilder() {
        this.$$filters = {};
        this.setSize(20);
    }
    RootBuilder.prototype.setQuery = function (query) {
        _.defaultsDeep(this, query);
    };
    RootBuilder.prototype.setSize = function (size) {
        this.size = size;
    };
    RootBuilder.prototype.setFrom = function (from) {
        this.from = from;
    };
    RootBuilder.prototype.addFilter = function (key, bool) {
        this.$$filters[key] = bool;
        _.defaultsDeep(this, {
            filter: { bool: { must: [] } }
        });
        this.filter.bool.must.push(bool);
        return this;
    };
    RootBuilder.prototype.getFilters = function (key) {
        if (key === void 0) { key = undefined; }
        if (!_.isArray(key)) {
            key = [key];
        }
        var filters = _.values(_.omit(this.$$filters, key));
        return { bool: { must: filters } };
    };
    RootBuilder.prototype.setAggs = function (key, aggs) {
        this.aggs = this.aggs || {};
        this.aggs[key] = aggs;
    };
    RootBuilder.prototype.getJSON = function () {
        var replacer = function (key, value) {
            if (/^\$\$/.test(key)) {
                return undefined;
            }
            else {
                return value;
            }
        };
        return JSON.parse(JSON.stringify(this, replacer));
    };
    return RootBuilder;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootBuilder;
//# sourceMappingURL=RootBuilder.js.map