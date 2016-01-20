var _this = this;
var React = require("react");
var enzyme_1 = require("enzyme");
var RangeFilter_tsx_1 = require("../src/RangeFilter.tsx");
var core_1 = require("../../../../../core");
describe("Reset Filter tests", function () {
    beforeEach(function () {
        _this.searchkit = new core_1.SearchkitManager("localhost:9200", { useHistory: true });
        _this.createWrapper = function () {
            _this.wrapper = enzyme_1.mount(React.createElement(RangeFilter_tsx_1.RangeFilter, {"id": "m", "searchkit": _this.searchkit, "field": "metascore", "min": 0, "max": 100, "title": "metascore", "showHistogram": true}));
        };
    });
    it('renders correctly', function () {
        _this.createWrapper();
        _this.searchkit.setResults({});
    });
});
//# sourceMappingURL=RangeFilterSpec.js.map