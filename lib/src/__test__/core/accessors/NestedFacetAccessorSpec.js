var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("NestedFacetAccessor", function () {
    beforeEach(function () {
        _this.options = {
            field: "taxonomy",
            id: "categories",
            title: "Categories",
            orderKey: "taxonomy.order",
            orderDirection: "desc"
        };
        _this.accessor = new _1.NestedFacetAccessor("categories", _this.options);
        _this.accessor.uuid = "999";
        _this.query = new _1.ImmutableQuery();
        _this.toPlainObject = function (ob) {
            return JSON.parse(JSON.stringify(ob));
        };
    });
    it("getBuckets()", function () {
        _this.accessor.results = {
            aggregations: {
                "categories": {
                    "children": {
                        "lvl1": {
                            children: {
                                buckets: [1, 2, 3]
                            }
                        },
                        "lvl2": {
                            children: {
                                buckets: [4, 5, 6]
                            }
                        }
                    }
                }
            }
        };
        expect(_this.accessor.getBuckets(1))
            .toEqual([1, 2, 3]);
        expect(_this.accessor.getBuckets(2))
            .toEqual([4, 5, 6]);
        expect(_this.accessor.getBuckets(4))
            .toEqual([]);
    });
    it("getTermAggs()", function () {
        expect(_this.accessor.getTermAggs()).toEqual(_1.TermsBucket("children", "taxonomy.value", { size: 0, order: { taxonomy_order: "desc" } }, _1.MinMetric("taxonomy_order", "taxonomy.order")));
        _this.options.orderKey = "_count";
        _this.options.orderDirection = "asc";
        expect(_this.accessor.getTermAggs()).toEqual(_1.TermsBucket("children", "taxonomy.value", { size: 0, order: { "_count": "asc" } }));
        delete _this.options.orderKey;
        delete _this.options.orderDirection;
        expect(_this.accessor.getTermAggs()).toEqual(_1.TermsBucket("children", "taxonomy.value", { size: 0, order: undefined }));
    });
    it("buildSharedQuery", function () {
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val");
        expect(_this.toPlainObject(_this.accessor.state.getValue()))
            .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val"]]);
        //
        var query = _this.accessor.buildSharedQuery(_this.query);
        var expected = _1.BoolMust([
            _1.NestedQuery("taxonomy", _1.BoolMust([
                _1.TermQuery("taxonomy.ancestors", "lvl1val"),
                _1.TermQuery("taxonomy.ancestors", "lvl2val"),
                _1.TermQuery("taxonomy.value", "lvl3val")
            ]))
        ]);
        expect(query.query.filter).toEqual(expected);
        var selectedFilters = query.getSelectedFilters();
        expect(_this.toPlainObject(selectedFilters[0])).toEqual({
            id: 'categories',
            name: 'lvl2val',
            value: 'lvl3val'
        });
        selectedFilters[0].remove();
        expect(_this.toPlainObject(_this.accessor.state.getValue()))
            .toEqual([["lvl1val"], ['lvl2val']]);
    });
    it("buildOwnQuery()", function () {
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val");
        _this.query = _this.query.addFilter("other", _1.BoolShould(["foo"]));
        var query = _this.accessor.buildSharedQuery(_this.query);
        query = _this.accessor.buildOwnQuery(query);
        expect(_.keys(query.index.filtersMap)).toEqual(['other', '999']);
        var termsBucket = _1.TermsBucket("children", "taxonomy.value", { size: 0, order: { taxonomy_order: "desc" } }, _1.MinMetric("taxonomy_order", "taxonomy.order"));
        var expected = _1.FilterBucket("categories", _1.BoolMust([_1.BoolShould(["foo"])]), _1.NestedBucket("children", "taxonomy", _1.FilterBucket("lvl0", _1.BoolMust([
            _1.TermQuery("taxonomy.level", 1)
        ]), termsBucket), _1.FilterBucket("lvl1", _1.BoolMust([
            _1.TermQuery("taxonomy.level", 2),
            _1.TermQuery("taxonomy.ancestors", "lvl1val")
        ]), termsBucket), _1.FilterBucket("lvl2", _1.BoolMust([
            _1.TermQuery("taxonomy.level", 3),
            _1.TermQuery("taxonomy.ancestors", "lvl1val"),
            _1.TermQuery("taxonomy.ancestors", "lvl2val")
        ]), termsBucket), _1.FilterBucket("lvl3", _1.BoolMust([
            _1.TermQuery("taxonomy.level", 4),
            _1.TermQuery("taxonomy.ancestors", "lvl1val"),
            _1.TermQuery("taxonomy.ancestors", "lvl2val"),
            _1.TermQuery("taxonomy.ancestors", "lvl3val")
        ]), termsBucket)));
        expect(query.query.aggs).toEqual(expected);
    });
});
//# sourceMappingURL=NestedFacetAccessorSpec.js.map