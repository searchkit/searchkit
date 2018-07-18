Object.defineProperty(exports, "__esModule", { value: true });
var defaults = require("lodash/defaults");
var PaginationHelper = /** @class */ (function () {
    function PaginationHelper(_a) {
        var currentPage = _a.currentPage, totalPages = _a.totalPages, translate = _a.translate;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.translate = translate;
        this.pages = [];
        this.lastPage = 0; // Last added page number
    }
    PaginationHelper.prototype.push = function (item) {
        this.pages.push(item);
    };
    PaginationHelper.prototype.previous = function (options) {
        if (options === void 0) { options = {}; }
        this.push(defaults({
            key: "previous",
            label: this.translate('pagination.previous'),
            page: this.currentPage > 1 ? (this.currentPage - 1) : undefined,
            disabled: this.currentPage === 1
        }, options));
    };
    PaginationHelper.prototype.next = function (options) {
        if (options === void 0) { options = {}; }
        this.push(defaults({
            key: "next",
            label: this.translate('pagination.next'),
            page: this.currentPage < this.totalPages - 1 ? (this.currentPage + 1) : undefined,
            disabled: this.currentPage === this.totalPages
        }, options));
    };
    PaginationHelper.prototype.page = function (pageNumber, options) {
        if (options === void 0) { options = {}; }
        if (pageNumber > 0 && pageNumber <= this.totalPages) {
            this.push(defaults({
                key: pageNumber,
                label: '' + pageNumber,
                page: pageNumber,
                active: pageNumber == this.currentPage
            }, options));
        }
    };
    PaginationHelper.prototype.range = function (minPage, maxPage, options) {
        if (options === void 0) { options = {}; }
        var min = Math.max(1, minPage);
        var max = Math.min(maxPage, this.totalPages);
        for (var i = min; i <= max; i++) {
            this.page(i, options);
        }
    };
    PaginationHelper.prototype.ellipsis = function (options) {
        if (options === void 0) { options = {}; }
        this.push(defaults({
            key: "ellipsis-" + this.pages.length,
            label: '...',
            disabled: true
        }, options));
    };
    return PaginationHelper;
}());
exports.PaginationHelper = PaginationHelper;
exports.Paginator = {
    build: function (_a) {
        var _b = _a.showNumbers, showNumbers = _b === void 0 ? true : _b, _c = _a.showPrevious, showPrevious = _c === void 0 ? true : _c, _d = _a.showNext, showNext = _d === void 0 ? true : _d, _e = _a.showEllipsis, showEllipsis = _e === void 0 ? true : _e, _f = _a.showFirst, showFirst = _f === void 0 ? true : _f, _g = _a.showLast, showLast = _g === void 0 ? false : _g;
        return function (currentPage, totalPages, translate, pageScope) {
            if (pageScope === void 0) { pageScope = 3; }
            var builder = new PaginationHelper({
                currentPage: currentPage, totalPages: totalPages, translate: translate
            });
            if (showPrevious)
                builder.previous();
            if (showNumbers) {
                if (showFirst && currentPage > pageScope + 1)
                    builder.page(1);
                if (showEllipsis && currentPage > pageScope + 2)
                    builder.ellipsis();
                builder.range(currentPage - pageScope, currentPage - 1);
                builder.page(currentPage, { active: true });
                builder.range(currentPage + 1, currentPage + pageScope);
                var lastEllipsisLimit = showLast ? (totalPages - pageScope - 1) : (totalPages - pageScope);
                if (showEllipsis && currentPage < lastEllipsisLimit)
                    builder.ellipsis();
                if (showLast && (currentPage < totalPages - pageScope))
                    builder.page(totalPages);
            }
            if (showNext)
                builder.next();
            return builder.pages;
        };
    }
};
//# sourceMappingURL=PaginationUtils.js.map