var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var classNames = require('classnames');
var SearchkitComponent_1 = require("../../../SearchkitComponent");
var PaginationAccessor_1 = require("../../../../domain/accessors/PaginationAccessor");
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
        return new PaginationAccessor_1.default("p");
    };
    Pagination.prototype.hasPagination = function () {
        return !!this.searcher.stateManager.getData();
    };
    Pagination.prototype.getCurrentPage = function () {
        return Number(this.accessor.state.get()) || 1;
    };
    Pagination.prototype.setPage = function (direction) {
        if (this.isDisabled(direction)) {
            return;
        }
        ;
        var currentPage = this.getCurrentPage();
        if (direction == DIRECTION.PREVIOUS) {
            this.accessor.state.set(currentPage - 1);
        }
        else if (direction == DIRECTION.NEXT) {
            this.accessor.state.set(currentPage + 1);
        }
        this.accessor.search();
        window.scrollTo(0, 0);
    };
    Pagination.prototype.isDisabled = function (direction) {
        var currentPage = this.getCurrentPage();
        var totalPages = Math.ceil(_.get(this.searcher, "results.hits.total", 1)
            /
                _.get(this.searcher, "query.size", 10));
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
        return (React.createElement("div", {"onClick": this.setPage.bind(this, direction), "className": className}, React.createElement("div", {"className": "pagination-nav-item__text"}, displayText)));
        var _a;
    };
    Pagination.prototype.render = function () {
        return (React.createElement("div", {"className": "pagination-navigation"}, this.paginationElement(DIRECTION.PREVIOUS, "prev", "Previous"), this.paginationElement(DIRECTION.NEXT, "next", "Next")));
    };
    return Pagination;
})(SearchkitComponent_1.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pagination;
//# sourceMappingURL=Pagination.js.map