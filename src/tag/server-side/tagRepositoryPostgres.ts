import TagRepositoryInterface from '../domain/ports/tagRepositoryInterface';
import Tag from '../domain/model/tag';
import { Row, Sql } from 'postgres';

export default class TagRepositoryPostgres implements TagRepositoryInterface {
    constructor(private readonly _sql: Sql) {}

    async getList(): Promise<Tag[]> {
        return await this._sql`SELECT * FROM "tag"`.then((rows) => {
            return rows.map(TagRepositoryPostgresFactory.create);
        });
    }
}

export class TagRepositoryPostgresFactory {
    static create(row: Row): Tag {
        return new Tag(row.id, row.label, row.created_at, row.updated_at);
    }
}
