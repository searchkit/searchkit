var State = (function () {
    function State(value) {
        if (value === void 0) { value = null; }
        this.value = value;
    }
    State.prototype.create = function (value) {
        return new this.constructor(value);
    };
    State.prototype.setValue = function (value) {
        return this.create(value);
    };
    State.prototype.clear = function () {
        return this.create(null);
    };
    State.prototype.getValue = function () {
        return this.value;
    };
    State.prototype.hasValue = function () {
        return !!(this.value);
    };
    return State;
})();
exports.State = State;
//# sourceMappingURL=State.js.map