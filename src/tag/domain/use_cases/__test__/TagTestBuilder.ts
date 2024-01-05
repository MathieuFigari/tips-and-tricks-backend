import Tag from '../../model/tag';
import * as dotenv from 'dotenv';
dotenv.config();

export default class TagTestBuilder {
    private _id: number | null = 1;
    private _label: string = 'un super label';
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildTag(): Tag {
        return new Tag(this._id, this._label, this._created_at, this._updated_at);
    }

    withId(id: number): TagTestBuilder {
        this._id = id;
        return this;
    }

    withLabel(label: string): TagTestBuilder {
        this._label = label;
        return this;
    }
}
