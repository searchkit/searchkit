var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var classNames = require('classnames');
var core_1 = require("../../../../core");
require("./../styles/index.scss");
(function (DIRECTION) {
    DIRECTION[DIRECTION["NEXT"] = 0] = "NEXT";
    DIRECTION[DIRECTION["PREVIOUS"] = 1] = "PREVIOUS";
})(exports.DIRECTION || (exports.DIRECTION = {}));
var DIRECTION = exports.DIRECTION;
var Pagination = (function (_super) {
    __extends(Pagination, _super);
    function Pagination() {
        _super.apply(this, arguments);
    }
    Pagination.prototype.defineAccessor = function () {
        return new core_1.PaginationAccessor("p");
    };
    Pagination.prototype.hasPagination = function () {
        // return !!this.searcher.stateManager.getData()
        return true;
    };
    Pagination.prototype.getCurrentPage = function () {
        return Number(this.accessor.state.getValue()) || 1;
    };
    Pagination.prototype.setPage = function (direction) {
        if (this.isDisabled(direction)) {
            return;
        }
        ;
        var currentPage = this.getCurrentPage();
        if (direction == DIRECTION.PREVIOUS) {
            this.accessor.state = this.accessor.state.setValue(currentPage - 1);
        }
        else if (direction == DIRECTION.NEXT) {
            this.accessor.state = this.accessor.state.setValue(currentPage + 1);
        }
        this.searchkit.performSearch();
        window.scrollTo(0, 0);
    };
    Pagination.prototype.isDisabled = function (direction) {
        var currentPage = this.getCurrentPage();
        var totalPages = Math.ceil(_.get(this.searcher, "results.hits.total", 1)
            /
                _.get(this.searcher, "query.query.size", 10));
        if (direction == DIRECTION.PREVIOUS && currentPage == 1) {
            return true;
        }
        if (direction == DIRECTION.NEXT && currentPage == totalPages) {
            return true;
        }
        return false;
    };
    Pagination.prototype.paginationElement = function (direction, cssClass, displayText) {
        var className = classNames((_a = {},
            _a["pagination-navigation__" + cssClass] = true,
            _a["pagination-nav-item"] = true,
            _a["pagination-nav-item--disabled"] = this.isDisabled(direction),
            _a
        ));
        return (React.createElement(core_1.FastClick, {"handler": this.setPage.bind(this, direction)}, React.createElement("div", {"className": className}, React.createElement("div", {"className": "pagination-nav-item__text"}, displayText))));
        var _a;
    };
    Pagination.prototype.render = function () {
        return (React.createElement("div", {"className": "pagination-navigation"}, this.paginationElement(DIRECTION.PREVIOUS, "prev", "Previous"), this.paginationElement(DIRECTION.NEXT, "next", "Next")));
    };
    return Pagination;
})(core_1.SearchkitComponent);
exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map