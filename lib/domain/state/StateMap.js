var _ = require("lodash");
var StateMap = (function () {
    function StateMap() {
        this.autoExpiryKeys = [];
        this.state = {};
    }
    StateMap.prototype.boundStateMap = function (key) {
        return {
            get: this.get.bind(this, key),
            getState: this.getState.bind(this),
            setState: this.setState.bind(this),
            add: this.add.bind(this, key),
            set: this.set.bind(this, key),
            toggle: this.toggle.bind(this, key),
            contains: this.contains.bind(this, key),
            hasKey: this.hasKey.bind(this, key),
            clear: this.clear.bind(this, key),
            clearAll: this.clearAll.bind(this),
            remove: this.remove.bind(this, key)
        };
    };
    StateMap.prototype.get = function (key) {
        return this.state[key];
    };
    StateMap.prototype.getState = function () {
        return this.state;
    };
    StateMap.prototype.setState = function (state) {
        this.state = state;
    };
    StateMap.prototype.addAutoExpiryKey = function (key) {
        this.autoExpiryKeys.push(key);
    };
    StateMap.prototype.keyChanged = function (key) {
        var _this = this;
        if (!_.contains(this.autoExpiryKeys, key)) {
            _.each(this.autoExpiryKeys, function (key) {
                delete _this.state[key];
            });
        }
    };
    StateMap.prototype.add = function (key, val) {
        this.keyChanged(key);
        this.lazyInitKey(key).push(val);
    };
    StateMap.prototype.set = function (key, val) {
        this.keyChanged(key);
        this.state[key] = val;
    };
    StateMap.prototype.toggle = function (key, val) {
        if (this.contains(key, val)) {
            this.remove(key, val);
        }
        else {
            this.add(key, val);
        }
    };
    StateMap.prototype.contains = function (key, val) {
        return this.state[key] && _.contains(this.state[key], val);
    };
    StateMap.prototype.hasKey = function (key) {
        return !!this.state[key];
    };
    StateMap.prototype.clear = function (key) {
        this.keyChanged(key);
        delete this.state[key];
    };
    StateMap.prototype.clearAll = function () {
        this.state = {};
    };
    StateMap.prototype.remove = function (key, val) {
        if (this.hasKey(key)) {
            this.keyChanged(key);
            this.state[key] = _.without(this.state[key], val);
        }
    };
    StateMap.prototype.lazyInitKey = function (key) {
        return (this.state[key] = this.state[key] || []);
    };
    return StateMap;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StateMap;
//# sourceMappingURL=StateMap.js.map