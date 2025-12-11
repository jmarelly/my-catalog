import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from './user.model';
import { User, NewUser } from './user.schema';
import { TCreateUser } from './user.types';

const SALT_ROUNDS = 10;

export default class UserService {
  constructor(private userModel: UserModel) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(
    inputPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  async createUser(props: TCreateUser): Promise<User> {
    const hashedPassword = await this.hashPassword(props.password);
    const newUser: NewUser = {
      id: uuidv4(),
      username: props.username.toLowerCase(),
      password: hashedPassword,
      role: props.role || 'admin',
    };

    this.userModel.create(newUser);
    return this.getUserByUsername(props.username) as Promise<User>;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findByUsername(username);
  }
}
