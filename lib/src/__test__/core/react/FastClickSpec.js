var _this = this;
var React = require("react");
var _1 = require("../../../");
var enzyme_1 = require("enzyme");
describe("FastClick", function () {
    beforeEach(function () {
        _this.handler = jasmine.createSpy("fastclick handler");
        _this.wrapper = enzyme_1.mount(React.createElement(_1.FastClick, {"handler": _this.handler}, React.createElement("button", null, "click me")));
    });
    it("should render children", function () {
        expect(_this.wrapper.html())
            .toEqual("<button>click me</button>");
    });
    it("test mousedown", function () {
        _this.wrapper.simulate("mouseDown", { button: 1 });
        expect(_this.handler).not.toHaveBeenCalled();
        _this.wrapper.simulate("mouseDown", { button: 0 });
        expect(_this.handler).toHaveBeenCalled();
    });
    describe("Touch events", function () {
        beforeEach(function () {
            _this.fastClick = _this.wrapper.node;
            _this.simulateTouch = function (event, x, y) {
                _this.wrapper.simulate(event, {
                    changedTouches: [{ pageX: x, pageY: y }]
                });
            };
            _this.simulateTouch("touchStart", 10, 20);
            expect(_this.fastClick.supportsTouch).toBe(true);
            expect(_this.fastClick.startPoint).toEqual({
                x: 10, y: 20
            });
        });
        it("test touch above threshold", function () {
            _this.simulateTouch("touchEnd", 30, 40);
            expect(_this.handler).not.toHaveBeenCalled();
            expect(_this.fastClick.startPoint).toBe(undefined);
            //ignore mousedowns if supports touch
            _this.wrapper.simulate("mouseDown", { button: 0 });
            expect(_this.handler).not.toHaveBeenCalled();
        });
        it("test touch within threshold", function () {
            _this.simulateTouch("touchEnd", 29, 39);
            expect(_this.handler).toHaveBeenCalled();
            expect(_this.fastClick.startPoint).toBe(undefined);
        });
        it("ignore multiple touch", function () {
            _this.wrapper.simulate("touchStart", {
                changedTouches: [
                    { pageX: 1, pageY: 2 },
                    { pageX: 10, pageY: 22 }
                ]
            });
            expect(_this.fastClick.startPoint).toBe(null);
        });
    });
});
//# sourceMappingURL=FastClickSpec.js.map