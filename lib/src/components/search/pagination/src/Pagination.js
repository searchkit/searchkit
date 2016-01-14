var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
require("../styles/index.scss");
var core_1 = require("../../../../core");
(function (DIRECTION) {
    DIRECTION[DIRECTION["NEXT"] = 0] = "NEXT";
    DIRECTION[DIRECTION["PREVIOUS"] = 1] = "PREVIOUS";
})(exports.DIRECTION || (exports.DIRECTION = {}));
var DIRECTION = exports.DIRECTION;
var Pagination = (function (_super) {
    __extends(Pagination, _super);
    function Pagination() {
        _super.apply(this, arguments);
        this.translations = {
            "pagination.previous": "Previous",
            "pagination.next": "Next"
        };
    }
    Pagination.prototype.defineAccessor = function () {
        return new core_1.PaginationAccessor("p");
    };
    Pagination.prototype.defineBEMBlocks = function () {
        var block = (this.props.mod || "pagination-navigation");
        return {
            container: block,
            option: block + "-item"
        };
    };
    Pagination.prototype.hasPagination = function () {
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
        var totalPages = Math.ceil(_.get(this.getResults(), ".hits.total", 1)
            /
                _.get(this.getQuery(), "query.size", 10));
        if (direction == DIRECTION.PREVIOUS && currentPage == 1) {
            return true;
        }
        if (direction == DIRECTION.NEXT && currentPage == totalPages) {
            return true;
        }
        return false;
    };
    Pagination.prototype.paginationElement = function (direction, cssClass, displayText) {
        var className = this.bemBlocks.option()
            .mix(this.bemBlocks.container("item"))
            .mix(this.bemBlocks.option(cssClass))
            .state({
            disabled: this.isDisabled(direction)
        });
        return (React.createElement(core_1.FastClick, {"handler": this.setPage.bind(this, direction)}, React.createElement("div", {"className": className, "data-qa": direction}, React.createElement("div", {"className": this.bemBlocks.option("text")}, this.translate(displayText)))));
    };
    Pagination.prototype.render = function () {
        if (this.hasHits()) {
            return (React.createElement("div", {"className": this.bemBlocks.container(), "data-qa": "pagination"}, this.paginationElement(DIRECTION.PREVIOUS, "prev", "pagination.previous"), this.paginationElement(DIRECTION.NEXT, "next", "pagination.next")));
        }
        return null;
    };
    return Pagination;
})(core_1.SearchkitComponent);
exports.Pagination = Pagination;
//# sourceMappingURL=Pagination.js.map