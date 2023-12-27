import Tips from '../../models/Tips';
import * as dotenv from 'dotenv';
dotenv.config();

export default class TipsTestBuilder {
    private _id: number | null = 1;
    private _user_id: number = 1;
    private _title: string = 'Un superbe tips !';
    private _command: string = 'npm run dev';
    private _description: string;

    private readonly _published_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildTips(): Tips {
        return new Tips(
            this._id,
            this._user_id,
            this._title,
            this._command,
            this._description,
            this._published_at,
            this._created_at,
            this._updated_at,
        );
    }

    withId(id: number): TipsTestBuilder {
        this._id = id;
        return this;
    }

    withTitle(title: string): TipsTestBuilder {
        this._title = title;
        return this;
    }

    withCommand(command: string): TipsTestBuilder {
        this._command = command;
        return this;
    }

    withDescription(description: string): TipsTestBuilder {
        this._description = description;
        return this;
    }

    withUserId(userId: number): TipsTestBuilder {
        this._user_id = userId;
        return this;
    }
}
