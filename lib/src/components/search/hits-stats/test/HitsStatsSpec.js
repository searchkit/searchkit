var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var HitsStats_tsx_1 = require("../src/HitsStats.tsx");
var core_1 = require("../../../../core");
var bem = require("bem-cn");
fdescribe("HitsStats tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: false });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(HitsStats_tsx_1.HitsStats, {"searchkit": _this.searchkit, "translations": { "ResultsFound": "movies found" }}));
        };
    });
    it('renders correctly', function () {
        _this.searchkit.setResults({
            hits: {
                total: 10
            }
        });
        _this.createWrapper();
        expect(_this.wrapper.find(".hits-stats__info").text()).toEqual("10 movies found");
    });
});
//# sourceMappingURL=HitsStatsSpec.js.map