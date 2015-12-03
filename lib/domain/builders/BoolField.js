var BoolField = (function () {
    function BoolField() {
        this.bool = {};
    }
    BoolField.prototype.must = function (field) {
        this.setArrayField("must", field);
    };
    BoolField.prototype.should = function (field) {
        this.setArrayField("should", field);
    };
    BoolField.prototype.setArrayField = function (key, field) {
        this.bool[key] = this.bool[key] || [];
        this.bool[key].push(field);
        this.bool[key] = _.flatten(this.bool[key]);
    };
    return BoolField;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BoolField;
//# sourceMappingURL=BoolField.js.map