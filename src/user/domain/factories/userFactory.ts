import User from '../models/User';

export default class UserFactory {
    static createWithoutPassword(user: Required<User>): User {
        return new User(user.id, user.email, user.username, user.roles, user.created_at, user.updated_at);
    }
}
