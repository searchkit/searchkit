var _this = this;
var _1 = require("../../../");
var _ = require("lodash");
describe("HierarchicalFacetAccessor", function () {
    beforeEach(function () {
        _this.accessor = new _1.HierarchicalFacetAccessor("categories", {
            fields: ["lvl1", "lvl2", "lvl3"],
            id: "categories_id",
            title: "Categories",
            size: 20
        });
        _this.accessor.uuid = "999";
        _this.accessor.computeUuids();
        _this.query = new _1.ImmutableQuery();
        _this.toPlainObject = function (ob) {
            return JSON.parse(JSON.stringify(ob));
        };
    });
    it("getBuckets()", function () {
        _this.accessor.results = {
            aggregations: {
                categories_id: {
                    lvl2: {
                        lvl2: {
                            buckets: [1, 2, 3]
                        }
                    },
                    lvl3: {
                        lvl3: {
                            buckets: [4, 5, 6]
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
    it("buildSharedQuery", function () {
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val")
            .add(2, "lvl3val2");
        expect(_this.accessor.state.getValue())
            .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val", "lvl3val2"]]);
        var query = _this.accessor.buildSharedQuery(_this.query);
        // console.log(JSON.stringify(query.query.filter, null, 2 ))
        expect(query.query.filter).toEqual(_1.BoolMust([
            _1.TermQuery("lvl1", "lvl1val"),
            _1.TermQuery("lvl2", "lvl2val"),
            _1.BoolShould([
                _1.TermQuery("lvl3", "lvl3val"),
                _1.TermQuery("lvl3", "lvl3val2")
            ])
        ]));
        var selectedFilters = query.getSelectedFilters();
        expect(_this.toPlainObject(selectedFilters)).toEqual([
            {
                "id": "categories_id",
                "name": "lvl2val",
                "value": "lvl3val"
            },
            {
                "id": "categories_id",
                "name": "lvl2val",
                "value": "lvl3val2"
            }
        ]);
        // console.log(JSON.stringify(selectedFilters, null, 2 ))
        selectedFilters[0].remove();
        expect(_this.accessor.state.getValue())
            .toEqual([["lvl1val"], ['lvl2val'], ["lvl3val2"]]);
        selectedFilters[1].remove();
        expect(_this.accessor.state.getValue())
            .toEqual([["lvl1val"], ['lvl2val'], []]);
    });
    it("buildOwnQuery()", function () {
        _this.accessor.state = _this.accessor.state
            .add(0, "lvl1val")
            .add(1, "lvl2val")
            .add(2, "lvl3val");
        _this.query = _this.query.addFilter("other", _1.BoolShould(["foo"]));
        var query = _this.accessor.buildSharedQuery(_this.query);
        query = _this.accessor.buildOwnQuery(query);
        expect(_.keys(query.index.filtersMap)).toEqual([
            'other', '999lvl1', '999lvl2', '999lvl3'
        ]);
        // console.log(JSON.stringify(query.query.aggs, null, 2))
        var expected = _1.FilterBucket("categories_id", _1.BoolMust([_1.BoolShould(["foo"])]), _1.FilterBucket("lvl1", _1.BoolMust([]), _1.TermsBucket("lvl1", "lvl1", { size: 20 })), _1.FilterBucket("lvl2", _1.BoolMust([
            _1.TermQuery("lvl1", "lvl1val")
        ]), _1.TermsBucket("lvl2", "lvl2", { size: 20 })), _1.FilterBucket("lvl3", _1.BoolMust([
            _1.TermQuery("lvl1", "lvl1val"),
            _1.TermQuery("lvl2", "lvl2val")
        ]), _1.TermsBucket("lvl3", "lvl3", { size: 20 })));
        // console.log(JSON.stringify(expected, null, 2))
        expect(query.query.aggs).toEqual(expected);
    });
});
//# sourceMappingURL=HierarchicalFacetAccessorSpec.js.map