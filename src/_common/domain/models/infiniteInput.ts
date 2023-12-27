import User from '../../../user/domain/models/User';

export default class InfiniteInput {
    constructor(
        public start: number,
        public length: number,
        public user?: User,
    ) {}
}
