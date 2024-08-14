import { UserService } from "@/services/userService";
import bcrypt from "bcrypt";
import { User } from "@/entity/user";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Authentifie un utilisateur en utilisant son email et son mot de passe.
   * @param email - Email de l'utilisateur.
   * @param password - Mot de passe de l'utilisateur.
   * @returns L'utilisateur authentifié.
   * @throws Error si les informations d'identification sont invalides.
   */
  async login(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Identifiants invalides");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Identifiants invalides");
    }

    return user;
  }

  /**
   * Inscrit un nouvel utilisateur.
   * @param username - Nom d'utilisateur.
   * @param email - Email de l'utilisateur.
   * @param password - Mot de passe de l'utilisateur.
   * @param roleUuid - UUID du rôle de l'utilisateur.
   * @returns Le nouvel utilisateur inscrit.
   * @throws Error s'il y a un problème lors de l'inscription.
   */
  async register(username: string, email: string, password: string, roleUuid: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      is_active: true, 
      role: { role_uuid: roleUuid } as any, 
    });

    return newUser;
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur.
   * @param email - Email de l'utilisateur.
   * @param newPassword - Le nouveau mot de passe.
   * @returns L'utilisateur mis à jour.
   * @throws Error si l'utilisateur n'est pas trouvé.
   */
  async resetPassword(email: string, newPassword: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userService.updateUserFields(user.user_uuid, { password: hashedPassword });

    return user;
  }

  // Ajoutez d'autres méthodes liées à l'authentification si nécessaire
}