export default class InfiniteResponse<T> {
    constructor(
        public start: number,
        public length: number,
        public data: Array<T> = [],
    ) {}
}
