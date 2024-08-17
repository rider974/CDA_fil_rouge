import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { Role } from "@/entity/role";

import {
  EntityNotFoundError,
  UniqueConstraintViolationError,
} from "../errors/errors";
import { comparePassword,hashPassword } from "@/utils/authUtils";

interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  role: Role;
}

export class UserService {
  /**
   * Fetch all users from the database, including all infos.
   * @returns A list of all users.
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await AppDataSource.manager.find(User, {
        relations: ["role", "ressources", "comments", "sharingSessions"],
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("An error occurred while fetching users");
    }
  }

  /**
   * Fetch a user by their UUID.
   * @param user_uuid - The UUID of the user.
   * @returns The user if found, or null if not.
   */
  async getUserById(user_uuid: string): Promise<User | null> {
    try {
      return await AppDataSource.manager.findOne(User, {
        where: { user_uuid },
        relations: ["role", "ressources", "comments", "sharingSessions"],
      });
    } catch (error) {
      console.error("Error fetching user by UUID:", error);
      throw new Error("An error occurred while fetching the user");
    }
  }

  /**
   * Fetch a user by their email.
   * @param email - The email of the user.
   * @returns The user if found, or null if not.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await AppDataSource.manager.findOne(User, { where: { email } });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("An error occurred while fetching the user by email");
    }
  }

  /**
   * Fetch a user by their username.
   * @param username - The username of the user.
   * @returns The user if found, or null if not.
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      return await AppDataSource.manager.findOne(User, {
        where: { username },
        relations: ["role", "ressources", "comments", "sharingSessions"],
      });
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  /**
   * Fetch a role by its UUID.
   * @param role_uuid - The UUID of the role.
   * @returns The role if found, or null if not.
   */
  async getRoleById(role_uuid: string): Promise<Role | null> {
    return await AppDataSource.manager.findOne(Role, { where: { role_uuid } });
  }

  /**
   * Fetch a role by its name.
   * @param roleName - The name of the role.
   * @returns The role if found, or null if not.
   */
  async getRoleByName(roleName: string): Promise<Role | null> {
    try {
      const role = await AppDataSource.manager.findOne(Role, {
        where: { role_name: roleName },
      });
      return role || null;
    } catch (error) {
      console.error(`Error fetching role by name '${roleName}':`, error);
      throw new Error("Failed to fetch role by name");
    }
  }

  /**
   * Create a new user in the database.
   * @param userData - The data for the new user.
   * @returns The newly created user.
   * @throws EntityNotFoundError if the role is not found.
   * @throws UniqueConstraintViolationError if the username or email already exists.
   */
  async createUser(userData: CreateUserDTO): Promise<User> {
    try {
      const role = await this.getRoleById(userData.role.role_uuid);
      if (!role) {
        throw new EntityNotFoundError("Role", userData.role.role_uuid);
      }

      const existingUserByUsername = await this.getUserByUsername(
        userData.username
      );
      if (existingUserByUsername) {
        throw new UniqueConstraintViolationError("Username already exists");
      }

      const existingUserByEmail = await AppDataSource.manager.findOne(User, {
        where: { email: userData.email },
      });
      if (existingUserByEmail) {
        throw new UniqueConstraintViolationError("Email already exists");
      }

      const hashedPassword = await hashPassword(userData.password);

      const user = AppDataSource.manager.create(User, {
        ...userData,
        role,
        password: hashedPassword,
      });

      return await AppDataSource.manager.save(user);
    } catch (error) {
      if (
        error instanceof UniqueConstraintViolationError ||
        error instanceof EntityNotFoundError
      ) {
        throw error;
      }
      console.error("Error creating user:", error);
      throw new Error("An error occurred while creating the user");
    }
  }

  /**
   * Replace an existing user with new data.
   * @param user_uuid - The UUID of the user to replace.
   * @param userData - The new data for the user.
   * @returns The updated user or null if not found.
   * @throws EntityNotFoundError if the user or role is not found.
   * @throws UniqueConstraintViolationError if the username or email already exists.
   */
  async replaceUser(
    user_uuid: string,
    userData: CreateUserDTO
  ): Promise<User | null> {
    try {
      const existingUser = await this.getUserById(user_uuid);
      if (!existingUser) {
        throw new EntityNotFoundError("User", user_uuid);
      }

      const role = await this.getRoleById(userData.role.role_uuid);
      if (!role) {
        throw new EntityNotFoundError("Role", userData.role.role_uuid);
      }

      const hashedPassword = await hashPassword(userData.password);

      const updatedUser = await AppDataSource.manager.save(User, {
        ...existingUser,
        ...userData,
        password: hashedPassword,
        role,
      });
      return updatedUser;
    } catch (error) {
      if (
        error instanceof UniqueConstraintViolationError ||
        error instanceof EntityNotFoundError
      ) {
        throw error;
      }
      console.error("Error replacing user:", error);
      throw new Error("An error occurred while replacing the user");
    }
  }

  /**
   * Update specific fields of an existing user.
   * @param user_uuid - The UUID of the user to update.
   * @param userData - The partial data for the user.
   * @returns The updated user or null if not found.
   * @throws EntityNotFoundError if the user or role is not found.
   * @throws UniqueConstraintViolationError if the username or email already exists.
   */
  async updateUserFields(
    user_uuid: string,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const existingUser = await this.getUserById(user_uuid);
      if (!existingUser) {
        throw new EntityNotFoundError("User", user_uuid);
      }

      if (userData.role && userData.role.role_uuid) {
        const role = await this.getRoleById(userData.role.role_uuid);
        if (!role) {
          throw new EntityNotFoundError("Role", userData.role.role_uuid);
        }
        userData.role = role;
      }

      if (userData.username) {
        const existingUserByUsername = await this.getUserByUsername(
          userData.username
        );
        if (
          existingUserByUsername &&
          existingUserByUsername.user_uuid !== user_uuid
        ) {
          throw new UniqueConstraintViolationError("Username already exists");
        }
      }

      if (userData.email) {
        const existingUserByEmail = await AppDataSource.manager.findOne(User, {
          where: { email: userData.email },
        });
        if (
          existingUserByEmail &&
          existingUserByEmail.user_uuid !== user_uuid
        ) {
          throw new UniqueConstraintViolationError("Email already exists");
        }
      }

      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }

      await AppDataSource.manager.update(User, { user_uuid }, userData);
      return await this.getUserById(user_uuid);
    } catch (error) {
      if (
        error instanceof UniqueConstraintViolationError ||
        error instanceof EntityNotFoundError
      ) {
        throw error;
      }
      console.error("Error updating user fields:", error);
      throw new Error("An error occurred while updating the user fields");
    }
  }

  /**
   * Delete a user by their UUID.
   * @param user_uuid - The UUID of the user to delete.
   * @returns A boolean indicating if the user was successfully deleted.
   */
  async deleteUser(user_uuid: string): Promise<boolean> {
    try {
      const result = await AppDataSource.manager.delete(User, user_uuid);
      return (
        result.affected !== null &&
        result.affected !== undefined &&
        result.affected > 0
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("An error occurred while deleting the user");
    }
  }

  /**
   * Toggles the active status of a user by their UUID.
   * @param user_uuid - The UUID of the user to update.
   * @param is_active - The new active status to set.
   * @returns The updated user with the new active status, or null if not found.
   * @throws EntityNotFoundError if the user is not found.
   */
  async toggleUserActiveStatus(
    user_uuid: string,
    is_active: boolean
  ): Promise<User | null> {
    try {
      const user = await this.getUserById(user_uuid);
      if (!user) {
        throw new EntityNotFoundError("User", user_uuid);
      }

      user.is_active = is_active;
      await AppDataSource.manager.save(user);
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error toggling user active status:", error);
      throw new Error(
        "An error occurred while toggling the user active status"
      );
    }
  }

  /**
   * Checks if any users are associated with a specific role.
   * @param role_uuid - The UUID of the role to check.
   * @returns true if users are associated, false otherwise.
   */
  async hasUsersWithRole(role_uuid: string): Promise<boolean> {
    try {
      const users = await AppDataSource.manager.find(User, {
        where: { role: { role_uuid } },
      });
      return users.length > 0;
    } catch (error) {
      console.error(`Error checking users with role '${role_uuid}':`, error);
      throw new Error("An error occurred while checking users for the role");
    }
  }

  /**
   * Resets the user's password.
   * @param email - The user's email.
   * @param newPassword - The new password to set.
   * @returns The updated user.
   * @throws EntityNotFoundError if the user is not found.
   */
  async resetPassword(email: string, newPassword: string): Promise<User> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new EntityNotFoundError("User", email);
      }

      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;

      return await AppDataSource.manager.save(user);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error resetting password:", error);
      throw new Error("An error occurred while resetting the password");
    }
  }

/**
   * Vérifie les informations d'identification de l'utilisateur.
   * @param email - L'email de l'utilisateur.
   * @param password - Le mot de passe de l'utilisateur.
   * @returns L'utilisateur si les informations sont correctes.
   * @throws EntityNotFoundError si l'utilisateur n'est pas trouvé.
   * @throws Error si le mot de passe est incorrect.
   */
async login(email: string, password: string): Promise<User> {
  try {
    // Cherche l'utilisateur par email
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new EntityNotFoundError("User", email);
    }
    // Vérifie si le mot de passe est correct
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return user;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

}