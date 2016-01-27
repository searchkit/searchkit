var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require("./State");
var isArray = require("lodash/isArray");
var contains = require("lodash/includes");
var take = require("lodash/take");
var size = require("lodash/size");
var without = require("lodash/without");
var update = require("react-addons-update");
var LevelState = (function (_super) {
    __extends(LevelState, _super);
    function LevelState() {
        _super.apply(this, arguments);
    }
    LevelState.prototype.getValue = function () {
        return this.value || [];
    };
    LevelState.prototype.add = function (level, val) {
        var ob = this.getValue();
        if (!isArray(ob[level])) {
            ob = update(ob, (_a = {},
                _a[level] = { $set: [] },
                _a
            ));
        }
        ob = update(ob, (_b = {},
            _b[level] = { $push: [val] },
            _b
        ));
        return this.create(ob);
        var _a, _b;
    };
    LevelState.prototype.contains = function (level, val) {
        return contains(this.getValue()[level], val);
    };
    LevelState.prototype.clear = function (level) {
        if (level === void 0) { level = 0; }
        return this.create(take(this.getValue(), level));
    };
    LevelState.prototype.remove = function (level, val) {
        return this.create(update(this.getValue(), (_a = {},
            _a[level] = { $set: without(this.getValue()[level], val) },
            _a
        )));
        var _a;
    };
    LevelState.prototype.toggle = function (level, val) {
        if (this.contains(level, val)) {
            return this.remove(level, val);
        }
        else {
            return this.add(level, val);
        }
    };
    LevelState.prototype.getLevel = function (level) {
        return this.getValue()[level] || [];
    };
    LevelState.prototype.levelHasFilters = function (level) {
        return this.getLevel(level).length > 0;
    };
    LevelState.prototype.getLeafLevel = function () {
        return size(this.value) - 1;
    };
    LevelState.prototype.isLeafLevel = function (level) {
        return level === this.getLeafLevel();
    };
    LevelState.prototype.toggleLevel = function (level, key) {
        if (this.contains(level, key)) {
            if (this.isLeafLevel(level)) {
                return this.clear(level);
            }
            else {
                return this.clear(level + 1);
            }
        }
        else {
            return this.clear(level)
                .add(level, key);
        }
    };
    return LevelState;
})(State_1.State);
exports.LevelState = LevelState;
//# sourceMappingURL=LevelState.js.map