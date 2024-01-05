import Tag from '../model/tag';

export default interface TagRepositoryInterface {
    getList(): Promise<Tag[]>;
}
