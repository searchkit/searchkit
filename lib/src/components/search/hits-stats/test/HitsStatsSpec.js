var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var HitsStats_tsx_1 = require("../src/HitsStats.tsx");
var core_1 = require("../../../../core");
describe("HitsStats tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function (translations) {
            _this.wrapper = enzyme_1.mount(React.createElement(HitsStats_tsx_1.HitsStats, {"searchkit": _this.searchkit, "translations": translations}));
        };
    });
    it('renders correctly', function () {
        _this.searchkit.setResults({
            hits: {
                total: 10
            },
            took: 10
        });
        _this.createWrapper({ "hitstats.results_found": "{hitCount} movies found" });
        expect(_this.wrapper.find(".hits-stats__info").text()).toEqual("10 movies found");
        _this.createWrapper();
        expect(_this.wrapper.find(".hits-stats__info").text()).toEqual("10 results found in 10ms");
    });
});
//# sourceMappingURL=HitsStatsSpec.js.map