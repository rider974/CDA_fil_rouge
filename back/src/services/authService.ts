import { UserService } from "@/services/userService";
import bcrypt from "bcrypt";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  // Ajoutez d'autres méthodes liées à l'authentification si nécessaire
}