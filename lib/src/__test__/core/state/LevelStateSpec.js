var _this = this;
var _1 = require("../../../");
describe("LevelState", function () {
    beforeEach(function () {
        _this.initialState = [["a"], ["b"]];
        _this.state = new _1.LevelState(_this.initialState);
    });
    afterEach(function () {
        //test immutability
        expect(_this.state.value)
            .toEqual([["a"], ["b"]]);
    });
    it("getValue()", function () {
        expect(_this.state.getValue()).toEqual(_this.initialState);
        expect(_this.state.create(null).getValue()).toEqual([]);
    });
    it("add()", function () {
        expect(_this.state.add(2, "c").getValue())
            .toEqual([["a"], ["b"], ["c"]]);
        expect(_this.state.add(1, "c").getValue())
            .toEqual([["a"], ["b", "c"]]);
    });
    it("contains()", function () {
        expect(_this.state.contains(1, "b")).toEqual(true);
        expect(_this.state.contains(1, "c")).toEqual(false);
    });
    it("clear()", function () {
        var state = _this.state.create([['a'], ['b'], ['c']]);
        expect(state.clear().getValue()).toEqual([]);
        expect(state.clear(0).getValue()).toEqual([]);
        expect(state.clear(1).getValue()).toEqual([['a']]);
        expect(state.clear(2).getValue()).toEqual([['a'], ['b']]);
        expect(state.clear(3).getValue()).toEqual([['a'], ['b'], ['c']]);
    });
    it("remove()", function () {
        var state = new _1.LevelState([
            ['a', 'b'], ['c', 'd']
        ]);
        expect(state.remove(0, 'a').getValue()).toEqual([
            ['b'], ['c', 'd']
        ]);
        expect(state.remove(1, 'd').getValue()).toEqual([
            ['a', 'b'], ['c']
        ]);
        expect(state.remove(0, 'c').getValue()).toEqual([
            ['a', 'b'], ['c', 'd']
        ]);
    });
    it("toggle()", function () {
        expect(_this.state.toggle(0, 'c').getValue()).toEqual([
            ['a', 'c'], ['b']
        ]);
        expect(_this.state.toggle(0, 'a').getValue()).toEqual([
            [], ['b']
        ]);
    });
    it("getLevel()", function () {
        expect(_this.state.getLevel(0)).toEqual(['a']);
        expect(_this.state.getLevel(1)).toEqual(['b']);
        expect(_this.state.getLevel(2)).toEqual([]);
    });
    it("levelHasFilters()", function () {
        expect(_this.state.levelHasFilters(0)).toEqual(true);
        expect(_this.state.levelHasFilters(2)).toEqual(false);
    });
    it("isLeafLevel()", function () {
        expect(_this.state.isLeafLevel(0)).toEqual(false);
        expect(_this.state.isLeafLevel(2)).toEqual(false);
        expect(_this.state.isLeafLevel(1)).toEqual(true);
    });
    it("getLeafLevel()", function () {
        expect(_this.state.getLeafLevel()).toEqual(1);
        expect(_this.state.add(2, 'c').getLeafLevel())
            .toEqual(2);
        expect(_this.state.remove(0, 'a').getLeafLevel())
            .toEqual(1);
    });
    it("toggleLevel()", function () {
        var state = new _1.LevelState([
            ['a'], ['b'], ['c']
        ]);
        expect(state.toggleLevel(2, 'c').getValue())
            .toEqual([['a'], ['b']]);
        expect(state.toggleLevel(1, 'b').getValue())
            .toEqual([['a'], ['b']]);
        expect(state.toggleLevel(2, 'd').getValue())
            .toEqual([['a'], ['b'], ['d']]);
        expect(state.toggleLevel(1, 'd').getValue())
            .toEqual([['a'], ['d']]);
        expect(state.toggleLevel(0, 'a').getValue())
            .toEqual([['a']]);
        expect(state.toggleLevel(0, 'd').getValue())
            .toEqual([['d']]);
    });
});
//# sourceMappingURL=LevelStateSpec.js.map