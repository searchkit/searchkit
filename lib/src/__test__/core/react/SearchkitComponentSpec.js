var _this = this;
var _1 = require("../../../");
var block = require('bem-cn');
describe("SearchkitComponent", function () {
    beforeEach(function () {
        _this.component = new _1.SearchkitComponent();
        _this.component.props = {};
        _this.component.context = {};
    });
    it("SearchkitComponent.translatePropType", function () {
        var translations = {
            continueButton: "Continue",
            cancelButton: "Cancel"
        };
        var handler = _1.SearchkitComponent
            .translationsPropType(translations);
        expect(handler({ translations: {
                continueButton: "Continue..."
            } }, "translations", "MyComponent")).toEqual(null);
        expect(handler({ translations: {
                unknown1: "",
                unknown2: ""
            } }, "translations", "MyComponent")).toEqual(new Error("MyComponent: incorrect translations, unknown1,unknown2 keys are not included in continueButton,cancelButton"));
    });
    it("translate()", function () {
        var searchkit = _1.SearchkitManager.mock();
        searchkit.translateFunction = function (key) {
            return { "searchkit": "searchkit level" }[key];
        };
        _this.component.searchkit = searchkit;
        _this.component.props = {
            translations: {
                "prop": "prop level"
            }
        };
        _this.component.translations = {
            "component": "component level {interpolation}"
        };
        expect(_this.component.translate("searchkit"))
            .toEqual("searchkit level");
        expect(_this.component.translate("prop"))
            .toEqual("prop level");
        expect(_this.component.translate("component", {
            interpolation: "foo"
        })).toEqual("component level foo");
        expect(_this.component.translate("missing key"))
            .toEqual("missing key");
    });
    it("_computeBemBlocks()", function () {
        expect(_this.component._computeBemBlocks())
            .toEqual({});
        _this.component.defineBEMBlocks = function () {
            var block = "hits";
            return {
                container: block,
                item: block + "-hit"
            };
        };
        expect(_this.component._computeBemBlocks().container().toString())
            .toBe("hits");
        expect(_this.component._computeBemBlocks().container("loading").toString())
            .toBe("hits__loading");
    });
    it("_getSearchkit()", function () {
        expect(_this.component._getSearchkit()).toBe(undefined);
        _this.component.context.searchkit = "searchkit_via_context";
        expect(_this.component._getSearchkit())
            .toBe("searchkit_via_context");
        _this.component.props.searchkit = "searchkit_via_props";
        expect(_this.component._getSearchkit())
            .toBe("searchkit_via_props");
    });
    it("componentWillMount()", function () {
        spyOn(_this.component, "forceUpdate");
        var searchkit = _1.SearchkitManager.mock();
        _this.component._computeBemBlocks = function () { return "computedBemBlocks"; };
        var accessor = new _1.Accessor();
        _this.component.defineAccessor = function () { return accessor; };
        spyOn(console, "warn");
        _this.component.componentWillMount();
        expect(_this.component.bemBlocks).toBe("computedBemBlocks");
        expect(_this.component.searchkit).toBe(undefined);
        expect(_this.component.accessor).toBe(undefined);
        expect(console.warn).toHaveBeenCalledWith('No searchkit found in props or context for SearchkitComponent');
        _this.component.props = { searchkit: searchkit };
        _this.component.componentWillMount();
        expect(_this.component.searchkit).toBe(searchkit);
        expect(_this.component.accessor).toBe(accessor);
        expect(searchkit.accessors.accessors)
            .toEqual([accessor]);
        expect(_this.component.forceUpdate).not.toHaveBeenCalled();
        searchkit.emitter.trigger();
        expect(_this.component.forceUpdate).toHaveBeenCalled();
        expect(searchkit.emitter.listeners.length).toBe(1);
        _this.component.componentWillUnmount();
        expect(searchkit.emitter.listeners.length).toBe(0);
        //should removeAccessor    
        expect(searchkit.accessors.accessors).toEqual([]);
    });
    describe("getters", function () {
        beforeEach(function () {
            _this.searchkit = _1.SearchkitManager.mock();
            _this.results = {
                hits: {
                    hits: [1, 2, 3],
                    total: 3
                }
            };
            _this.searchkit.setResults(_this.results);
            _this.query = new _1.ImmutableQuery().setSize(10);
            _this.searchkit.query = _this.query;
            _this.component.searchkit = _this.searchkit;
        });
        it("getResults()", function () {
            expect(_this.component.getResults()).toBe(_this.results);
        });
        it("getHits()", function () {
            expect(_this.component.getHits()).toEqual([1, 2, 3]);
        });
        it("getHitsCount()", function () {
            expect(_this.component.getHitsCount()).toEqual(3);
        });
        it("hasHits()", function () {
            expect(_this.component.hasHits()).toBe(true);
        });
        it("getQuery()", function () {
            expect(_this.component.getQuery()).toBe(_this.query);
        });
        it("isInitialLoading()", function () {
            expect(_this.component.isInitialLoading()).toBe(false);
        });
        it("isLoading()", function () {
            expect(_this.component.isLoading()).toBe(false);
        });
        it("getError()", function () {
            expect(_this.component.getError()).toBe(null);
        });
    });
});
//# sourceMappingURL=SearchkitComponentSpec.js.map