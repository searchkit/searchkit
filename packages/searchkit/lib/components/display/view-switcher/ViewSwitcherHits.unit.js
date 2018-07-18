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
var ViewSwitcherToggle_1 = require("./ViewSwitcherToggle");
var ViewSwitcherHits_1 = require("./ViewSwitcherHits");
var ViewSwitcherConfig_1 = require("./ViewSwitcherConfig");
var ui_1 = require("../../ui");
var core_1 = require("../../../core");
var TestHelpers_1 = require("../../__test__/TestHelpers");
var map = require("lodash/map");
var MovieHitsGridItem = function (props) {
    return (React.createElement("div", { className: "grid-item" }, props.result.title));
};
var MovieHitsListItem = function (props) {
    return (React.createElement("div", { className: "list-item" }, props.result.title));
};
var MovieList = function (props) {
    return (React.createElement("div", { className: "custom-list" }, map(props.hits, "_id").join(",")));
};
describe("View Switcher Hits component", function () {
    describe('renders correctly', function () {
        beforeEach(function () {
            _this.searchkit = core_1.SearchkitManager.mock();
            _this.searchkit.setResults({
                hits: {
                    hits: [{ _id: 1, title: 1 }, { _id: 2, title: 2 }],
                    total: 2
                }
            });
            _this.setWrapper = function (props) {
                if (props === void 0) { props = {}; }
                _this.wrapper = enzyme_1.mount(React.createElement("div", null,
                    React.createElement(ViewSwitcherHits_1.ViewSwitcherHits, { searchkit: _this.searchkit, hitComponents: [
                            { key: "grid", title: "Grid", itemComponent: MovieHitsGridItem, defaultOption: true },
                            { key: "list", title: "List", itemComponent: MovieHitsListItem },
                            { key: "custom-list", title: "Custom List", listComponent: MovieList }
                        ], highlightFields: ["title"], hitsPerPage: 12, sourceFilter: ["title"] }),
                    React.createElement(ViewSwitcherToggle_1.ViewSwitcherToggle, __assign({ searchkit: _this.searchkit, translations: { "Grid": "My Grid" } }, props))));
            };
            _this.ViewOptionsAccessor = _this.searchkit.accessors.accessors[0];
        });
        it("View Switcher Hits", function () {
            _this.setWrapper();
            expect(_this.wrapper).toMatchSnapshot();
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle-option").at(1));
            _this.wrapper.update();
            expect(_this.wrapper).toMatchSnapshot();
            TestHelpers_1.fastClick(_this.wrapper.find(".sk-toggle-option").at(2));
            expect(_this.wrapper).toMatchSnapshot();
        });
        it("custom mod, className, listComponent", function () {
            _this.setWrapper({
                mod: "my-view-switcher", className: "customClass",
                listComponent: ui_1.Select
            });
            expect(_this.wrapper).toMatchSnapshot();
        });
        it("Works with ViewSwitcherConfig", function () {
            _this.wrapper = enzyme_1.mount(React.createElement("div", null,
                React.createElement(ViewSwitcherConfig_1.ViewSwitcherConfig, { searchkit: _this.searchkit, hitComponents: [
                        { key: "grid", title: "Grid", itemComponent: MovieHitsGridItem, defaultOption: true },
                        { key: "list", title: "List", itemComponent: MovieHitsListItem },
                        { key: "custom-list", title: "Custom List", listComponent: MovieList }
                    ] }),
                React.createElement(ViewSwitcherHits_1.ViewSwitcherHits, { searchkit: _this.searchkit, highlightFields: ["title"], hitsPerPage: 12, sourceFilter: ["title"] }),
                React.createElement(ViewSwitcherToggle_1.ViewSwitcherToggle, { searchkit: _this.searchkit, translations: { "Grid": "My Grid" } })));
            expect(_this.wrapper).toMatchSnapshot();
            TestHelpers_1.fastClick(_this.wrapper.find("div[data-key='list']"));
            expect(_this.wrapper.find("div[data-key='list']").hasClass("is-active")).toBe(true);
            expect(_this.wrapper).toMatchSnapshot();
        });
        it("renders null when no accessor available", function () {
            _this.wrapper = enzyme_1.mount(React.createElement("div", null,
                React.createElement(ViewSwitcherToggle_1.ViewSwitcherToggle, { searchkit: _this.searchkit, translations: { "Grid": "My Grid" } })));
            expect(_this.wrapper).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=ViewSwitcherHits.unit.js.map