Object.defineProperty(exports, "__esModule", { value: true });
var accessors_1 = require("./accessors");
var support_1 = require("./support");
var query_1 = require("./query");
var filter = require("lodash/filter");
var values = require("lodash/values");
var reduce = require("lodash/reduce");
var assign = require("lodash/assign");
var each = require("lodash/each");
var without = require("lodash/without");
var find = require("lodash/find");
var AccessorManager = /** @class */ (function () {
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
    AccessorManager.prototype.getAccessorsByType = function (type) {
        return filter(this.accessors, support_1.Utils.instanceOf(type));
    };
    AccessorManager.prototype.getAccessorByType = function (type) {
        return find(this.accessors, support_1.Utils.instanceOf(type));
    };
    AccessorManager.prototype.add = function (accessor) {
        if (accessor instanceof accessors_1.StatefulAccessor) {
            if (accessor instanceof accessors_1.BaseQueryAccessor && accessor.key == "q") {
                if (this.queryAccessor !== accessors_1.noopQueryAccessor) {
                    throw new Error("Only a single instance of BaseQueryAccessor is allowed");
                }
                else {
                    this.queryAccessor = accessor;
                }
            }
            var existingAccessor = this.statefulAccessors[accessor.key];
            if (existingAccessor) {
                if (existingAccessor.constructor === accessor.constructor) {
                    existingAccessor.incrementRef();
                    return existingAccessor;
                }
                else {
                    throw new Error("Multiple imcompatible components with id='" + accessor.key + "' existing on the page");
                }
            }
            else {
                this.statefulAccessors[accessor.key] = accessor;
            }
        }
        accessor.incrementRef();
        this.accessors.push(accessor);
        return accessor;
    };
    AccessorManager.prototype.remove = function (accessor) {
        if (!accessor) {
            return;
        }
        accessor.decrementRef();
        if (accessor.refCount === 0) {
            if (accessor instanceof accessors_1.StatefulAccessor) {
                if (this.queryAccessor == accessor) {
                    this.queryAccessor = accessors_1.noopQueryAccessor;
                }
                delete this.statefulAccessors[accessor.key];
            }
            this.accessors = without(this.accessors, accessor);
        }
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
        each(this.getActiveAccessors(), function (accessor) { return accessor.beforeBuildQuery(); });
        return this.buildOwnQuery(this.buildSharedQuery(new query_1.ImmutableQuery()));
    };
    AccessorManager.prototype.setResults = function (results) {
        each(this.accessors, function (a) { return a.setResults(results); });
    };
    AccessorManager.prototype.resetState = function () {
        each(this.getStatefulAccessors(), function (a) { return a.resetState(); });
    };
    return AccessorManager;
}());
exports.AccessorManager = AccessorManager;
//# sourceMappingURL=AccessorManager.js.map