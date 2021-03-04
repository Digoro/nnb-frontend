
export class Pagination<T> {
    constructor(
        public items: Array<T>,
        public meta: PaginationMeta,
    ) { }
}

export class PaginationMeta {
    constructor(
        public paginationId?: string,
        public totalItemsWithChildren?: number,
        public totalItems?: number,
        public itemCount?: number,
        public itemsPerPage?: number,
        public totalPages?: number,
        public currentPage?: number
    ) { }
}

export interface PaginationSearchDto {
    page?: number;
    limit?: number;
}