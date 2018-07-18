var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var HitsStats_1 = require("../src/HitsStats");
var core_1 = require("../../../../core");
describe("HitsStats tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function (props) {
            _this.wrapper = enzyme_1.mount(React.createElement(HitsStats_1.HitsStats, __assign({ searchkit: _this.searchkit }, props)));
        };
    });
    it('renders correctly', function () {
        _this.searchkit.setResults({
            hits: {
                total: 10
            },
            took: 10
        });
        _this.createWrapper({ translations: { "hitstats.results_found": "{hitCount} movies found" } });
        expect(_this.wrapper.find(".sk-hits-stats__info").text()).toEqual("10 movies found");
        _this.createWrapper({ countFormatter: function (count) { return "#" + count; } });
        expect(_this.wrapper.find(".sk-hits-stats__info").text()).toEqual("#10 results found in 10ms");
    });
    it('renders correctly - override component', function () {
        _this.searchkit.setResults({
            hits: {
                total: 10
            },
            took: 10
        });
        var overrideComponent = function (props) {
            return (React.createElement("div", null, props.hitsCount));
        };
        _this.createWrapper({ component: overrideComponent });
        expect(_this.wrapper.find("div").text()).toEqual("10");
    });
});
//# sourceMappingURL=HitsStatsSpec.js.map