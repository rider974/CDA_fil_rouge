import bcrypt from 'bcryptjs';
import { UserService } from './userService'; 
import { User } from './../entity/user';

export interface CreateAuthDTO {
  email: string;
  password: string;
}

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async login(authentificationData: CreateAuthDTO): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(authentificationData?.email);
      if (!user) {
        throw new Error('Identifiants invalides');
      }

      const isPasswordValid = await bcrypt.compare(authentificationData?.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Identifiants invalides');
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}