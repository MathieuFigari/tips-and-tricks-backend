import TagRepositoryInterface from '../domain/ports/tagRepositoryInterface';
import Tag from '../domain/model/tag';

export default class TagRepositoryInMemory implements TagRepositoryInterface {
    public tagInMemory: Array<Tag> = [];
    private _error: boolean = false;

    async getList(): Promise<Tag[]> {
        return this.tagInMemory;
    }

    setError(): TagRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): TagRepositoryInMemory {
        this.tagInMemory = [];
        return this;
    }

    setTag(tag: Tag): TagRepositoryInMemory {
        this.tagInMemory.push(tag);
        return this;
    }
}
