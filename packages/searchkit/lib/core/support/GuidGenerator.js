Object.defineProperty(exports, "__esModule", { value: true });
var GuidGenerator = /** @class */ (function () {
    function GuidGenerator() {
        this.counter = 0;
    }
    GuidGenerator.prototype.reset = function () {
        this.counter = 0;
    };
    GuidGenerator.prototype.guid = function (prefix) {
        if (prefix === void 0) { prefix = ""; }
        var id = ++this.counter;
        return prefix.toString() + id;
    };
    return GuidGenerator;
}());
exports.GuidGenerator = GuidGenerator;
//# sourceMappingURL=GuidGenerator.js.map