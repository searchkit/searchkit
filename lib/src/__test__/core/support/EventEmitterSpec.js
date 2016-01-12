var _this = this;
var _1 = require("../../../");
describe("EventEmitter", function () {
    beforeEach(function () {
        _this.emitter = new _1.EventEmitter();
    });
    it("constructor()", function () {
        expect(_this.emitter.listeners).toEqual([]);
    });
    it("add, trigger, remove", function () {
        var argsStr = "";
        var fn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            argsStr = args.join("");
        };
        var removeFn = _this.emitter.addListener(fn);
        expect(_this.emitter.listeners)
            .toEqual([fn]);
        _this.emitter.trigger("a", "b", "c");
        expect(argsStr).toEqual("abc");
        removeFn();
        expect(_this.emitter.listeners).toEqual([]);
    });
});
//# sourceMappingURL=EventEmitterSpec.js.map