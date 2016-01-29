var accessors_1 = require("./accessors");
var query_1 = require("./query");
var filter = require("lodash/filter");
var values = require("lodash/values");
var reduce = require("lodash/reduce");
var assign = require("lodash/assign");
var each = require("lodash/each");
var without = require("lodash/without");
var AccessorManager = (function () {
    function AccessorManager() {
        this.accessors = [];
        this.queryAccessor = accessors_1.noopQueryAccessor;
        this.statefulAccessors = {};
    }
    AccessorManager.prototype.getAccessors = function () {
        return this.accessors;
    };
    AccessorManager.prototype.getActiveAccessors = function () {
        return filter(this.accessors, { active: true });
    };
    AccessorManager.prototype.getStatefulAccessors = function () {
        return values(this.statefulAccessors);
    };
    AccessorManager.prototype.add = function (accessor) {
        if (accessor instanceof accessors_1.StatefulAccessor) {
            if (accessor instanceof accessors_1.BaseQueryAccessor) {
                if (this.queryAccessor !== accessors_1.noopQueryAccessor) {
                    throw new Error("Only a single instance of BaseQueryAccessor is allowed");
                }
                else {
                    this.queryAccessor = accessor;
                }
            }
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
    AccessorManager.prototype.remove = function (accessor) {
        if (!accessor) {
            return;
        }
        if (accessor instanceof accessors_1.StatefulAccessor) {
            if (this.queryAccessor == accessor) {
                this.queryAccessor = accessors_1.noopQueryAccessor;
            }
            delete this.statefulAccessors[accessor.key];
        }
        this.accessors = without(this.accessors, accessor);
    };
    AccessorManager.prototype.getState = function () {
        return reduce(this.getStatefulAccessors(), function (state, accessor) {
            return assign(state, accessor.getQueryObject());
        }, {});
    };
    AccessorManager.prototype.setState = function (state) {
        each(this.getStatefulAccessors(), function (accessor) { return accessor.fromQueryObject(state); });
    };
    AccessorManager.prototype.notifyStateChange = function (oldState) {
        each(this.getStatefulAccessors(), function (accessor) { return accessor.onStateChange(oldState); });
    };
    AccessorManager.prototype.getQueryAccessor = function () {
        return this.queryAccessor;
    };
    AccessorManager.prototype.buildSharedQuery = function (query) {
        return reduce(this.getActiveAccessors(), function (query, accessor) {
            return accessor.buildSharedQuery(query);
        }, query);
    };
    AccessorManager.prototype.buildOwnQuery = function (query) {
        return reduce(this.getActiveAccessors(), function (query, accessor) {
            return accessor.buildOwnQuery(query);
        }, query);
    };
    AccessorManager.prototype.buildQuery = function () {
        return this.buildOwnQuery(this.buildSharedQuery(new query_1.ImmutableQuery()));
    };
    AccessorManager.prototype.setResults = function (results) {
        each(this.accessors, function (a) { return a.setResults(results); });
    };
    AccessorManager.prototype.resetState = function () {
        each(this.getStatefulAccessors(), function (a) { return a.resetState(); });
    };
    return AccessorManager;
})();
exports.AccessorManager = AccessorManager;
//# sourceMappingURL=AccessorManager.js.map