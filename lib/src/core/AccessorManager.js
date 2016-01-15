var accessors_1 = require("./accessors");
var _ = require("lodash");
var AccessorManager = (function () {
    function AccessorManager() {
        this.accessors = [];
        this.statefulAccessors = {};
    }
    AccessorManager.prototype.getAccessors = function () {
        return this.accessors;
    };
    AccessorManager.prototype.getActiveAccessors = function () {
        return _.filter(this.accessors, { active: true });
    };
    AccessorManager.prototype.getStatefulAccessors = function () {
        return _.values(this.statefulAccessors);
    };
    AccessorManager.prototype.add = function (accessor) {
        if (accessor instanceof accessors_1.StatefulAccessor) {
            var existingAccessor = this.statefulAccessors[accessor.key];
            if (existingAccessor) {
                return existingAccessor;
            }
            else {
                this.statefulAccessors[accessor.key] = accessor;
            }
        }
        this.accessors.push(accessor);
        return accessor;
    };
    AccessorManager.prototype.getState = function () {
        return _.reduce(this.getStatefulAccessors(), function (state, accessor) {
            return _.extend(state, accessor.getQueryObject());
        }, {});
    };
    AccessorManager.prototype.setState = function (state) {
        _.each(this.getStatefulAccessors(), function (accessor) { return accessor.fromQueryObject(state); });
    };
    AccessorManager.prototype.notifyStateChange = function (oldState) {
        _.each(this.getStatefulAccessors(), function (accessor) { return accessor.onStateChange(oldState); });
    };
    AccessorManager.prototype.setQueryString = function (query) {
        _.each(this.getActiveAccessors(), function (a) { return a.onQueryStringChange(query); });
    };
    AccessorManager.prototype.resetFilters = function () {
        _.each(this.getActiveAccessors(), function (a) { return a.onResetFilters(); });
    };
    AccessorManager.prototype.buildSharedQuery = function (query) {
        return _.reduce(this.getActiveAccessors(), function (query, accessor) {
            return accessor.buildSharedQuery(query);
        }, query);
    };
    AccessorManager.prototype.buildOwnQuery = function (query) {
        return _.reduce(this.getActiveAccessors(), function (query, accessor) {
            return accessor.buildOwnQuery(query);
        }, query);
    };
    AccessorManager.prototype.buildQuery = function (query) {
        return this.buildOwnQuery(this.buildSharedQuery(query));
    };
    AccessorManager.prototype.setResults = function (results) {
        _.each(this.accessors, function (a) { return a.setResults(results); });
    };
    AccessorManager.prototype.resetState = function () {
        _.each(this.getStatefulAccessors(), function (a) { return a.resetState(); });
    };
    return AccessorManager;
})();
exports.AccessorManager = AccessorManager;
//# sourceMappingURL=AccessorManager.js.map