// custom
export interface ResponseAPI<T> {
    message: string,
    error: boolean,
    data: T
}

// paginate Spring response
export interface PaginateData<T>{
    content: T[],
    pageable: Pageable,
    totalPages: number,
    totalElements: number,
    last: boolean,
    size: number,
    number: number,
    sort: Sort,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface Pageable{
    sort: Sort,
    offset: number,
    pageNumber: number,
    pageSize: number,
    unpaged: boolean,
    paged: boolean
}

export interface Sort {
    empty: boolean,
    unsorted: boolean,
    sorted: boolean
}