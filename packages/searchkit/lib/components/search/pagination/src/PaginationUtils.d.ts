export declare class PaginationHelper {
    currentPage: number;
    totalPages: number;
    translate: Function;
    pages: Array<any>;
    lastPage: number;
    constructor({currentPage, totalPages, translate}: {
        currentPage: any;
        totalPages: any;
        translate: any;
    });
    push(item: any): void;
    previous(options?: {}): void;
    next(options?: {}): void;
    page(pageNumber: any, options?: {}): void;
    range(minPage: any, maxPage: any, options?: {}): void;
    ellipsis(options?: {}): void;
}
export declare const Paginator: {
    build({showNumbers, showPrevious, showNext, showEllipsis, showFirst, showLast}: {
        showNumbers?: boolean;
        showPrevious?: boolean;
        showNext?: boolean;
        showEllipsis?: boolean;
        showFirst?: boolean;
        showLast?: boolean;
    }): (currentPage: any, totalPages: any, translate: any, pageScope?: number) => any[];
};
