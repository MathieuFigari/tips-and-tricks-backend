import InputRegisterUser from '../models/inputRegisterUser';
import User from '../models/User';

export default interface UserRepositoryInterface {
    create(input: InputRegisterUser): Promise<User>;
    getByEmail(email: string): Promise<User & { password?: string; refresh_token?: string | null }>;
    getByUsername(username: string): Promise<User>;
    setRefreshToken(userId: number, refreshToken: string): Promise<boolean>;
    revokeToken(email: string): Promise<boolean>;
}
