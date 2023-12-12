export default interface Pagination {
    page: number
    limit: number
    pages: number
    total: number
    currentPage: number
    prevPage: string | null
    nextPage: string | null
}
