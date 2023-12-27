import * as dotenv from 'dotenv';
import Post, { PostFullData } from '../../model/post';
dotenv.config();

export default class PostTestBuilder {
    private _id: number | null = 1;
    private _user_id: number = 1;
    private _title: string = 'Un superbe post !';
    private _command: string = 'npm run dev';
    private _slug: string = 'un-superbe-post';
    private _message: string = 'mon message !';
    private _description: string = 'Vraiment super !';
    private _username: string = 'username';
    private _reactions: { like: number; dislike: number } = { like: 10, dislike: 10 };
    private readonly _published_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _created_at: Date = new Date('2022-12-17T03:24:00');
    private readonly _updated_at: Date | null = null;

    buildPost(): Post {
        return new Post(
            this._id,
            this._user_id,
            this._title,
            this._slug,
            this._description,
            this._message,
            this._command,
            this._reactions,
            this._published_at,
            this._created_at,
            this._updated_at,
        );
    }

    buildPostFullData(): PostFullData {
        return {
            ...this.buildPost(),
            username: this._username,
        };
    }

    withId(id: number): PostTestBuilder {
        this._id = id;
        return this;
    }

    withTitle(title: string): PostTestBuilder {
        this._title = title;
        return this;
    }

    withCommand(command: string): PostTestBuilder {
        this._command = command;
        return this;
    }

    withDescription(description: string): PostTestBuilder {
        this._description = description;
        return this;
    }

    withSlug(slug: string): PostTestBuilder {
        this._slug = slug;
        return this;
    }

    withMessage(message: string): PostTestBuilder {
        this._message = message;
        return this;
    }

    withUserId(userId: number): PostTestBuilder {
        this._user_id = userId;
        return this;
    }

    withLikes(likes: number): PostTestBuilder {
        this._reactions.like = likes;
        return this;
    }

    withDislikes(dislikes: number): PostTestBuilder {
        this._reactions.dislike = dislikes;
        return this;
    }

    withUsername(username: string): PostTestBuilder {
        this._username = username;
        return this;
    }
}
