import Tag from '../model/tag';
import TagRepositoryInterface from '../ports/tagRepositoryInterface';

export interface ListTagUseCaseInterface {
    getList(): Promise<Tag[]>;
}

export default class ListTagUseCase implements ListTagUseCaseInterface {
    constructor(private readonly _tagRepository: TagRepositoryInterface) {}

    async getList(): Promise<Tag[]> {
        const tags = await this._tagRepository.getList();
        return tags;
    }
}
