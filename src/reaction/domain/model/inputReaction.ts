export default class InputReaction {
    constructor(
        public readonly post_id: number,
        public readonly user_id: number,
        public readonly reaction: string | null,
    ) {}
}
