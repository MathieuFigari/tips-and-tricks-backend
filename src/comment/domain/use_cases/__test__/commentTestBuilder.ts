import Comment, { CommentFullData } from '../../model/comment';

export default class CommentTestBuilder {
    private _id: number = 1;
    private _user_id: number = 1;
    private _post_id: number = 1;
    private _content: string = 'new comment';
    private readonly _published_at: Date = new Date('2023-01-01T00:00:00Z');
    private readonly _created_at: Date = new Date('2023-01-01T00:00:00Z');
    private readonly _updated_at: Date | null = null;
    private _username: string = 'username';

    buildComment(): Comment {
        return new Comment(
            this._id,
            this._user_id,
            this._post_id,
            this._content,
            this._published_at,
            this._created_at,
            this._updated_at,
        );
    }

    buildCommentFullData(): CommentFullData {
        return {
            ...this.buildComment(),
            username: this._username,
        };
    }

    withId(id: number): CommentTestBuilder {
        this._id = id;
        return this;
    }

    withUserId(userId: number): CommentTestBuilder {
        this._user_id = userId;
        return this;
    }

    withPostId(postId: number): CommentTestBuilder {
        this._post_id = postId;
        return this;
    }

    withContent(content: string): CommentTestBuilder {
        this._content = content;
        return this;
    }

    withUsername(username: string): CommentTestBuilder {
        this._username = username;
        return this;
    }
}
