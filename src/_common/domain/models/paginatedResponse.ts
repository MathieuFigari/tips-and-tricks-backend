export default class PaginatedResponse<T> {
    constructor(
        public page: number,
        public length: number,
        public total: number,
        public data: Array<T> = [],
    ) {}
}
