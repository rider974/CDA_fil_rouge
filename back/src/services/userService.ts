import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { Role } from "@/entity/role";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors"; 

interface CreateUserDTO {
    role: Role;
    username: string;
    email: string;
    password: string;
    is_active?: boolean; 
    role_uuid: string; 
}

export class UserService {
    async getAllUsers(): Promise<User[]> {
        return await AppDataSource.manager.find(User, {
            relations: ['role'], 
        });
    }

    async getUserById(user_uuid: string): Promise<User | null> {
        try {
            return await AppDataSource.manager.findOne(User, { where: { user_uuid } });
        } catch (error) {
            console.error("Error fetching user by UUID:", error);
            throw error;
        }
    }

    async getUserByUsername(username: string): Promise<User | null> {
        try {
            return await AppDataSource.manager.findOne(User, { where: { username } });
        } catch (error) {
            console.error("Error fetching user by username:", error);
            throw error;
        }
    }

    async createUser(userData: CreateUserDTO): Promise<User> {
        try {
            // Vérifiez si le rôle existe
            const role = await AppDataSource.manager.findOne(Role, { where: { role_uuid: userData.role_uuid } });
            if (!role) {
                throw new EntityNotFoundError('Role', userData.role_uuid);
            }

            // Vérifiez si le username existe déjà
            const existingUserByUsername = await this.getUserByUsername(userData.username);
            if (existingUserByUsername) {
                throw new UniqueConstraintViolationError('Username already exists');
            }

            // Vérifiez si l'email existe déjà
            const existingUserByEmail = await AppDataSource.manager.findOne(User, { where: { email: userData.email } });
            if (existingUserByEmail) {
                throw new UniqueConstraintViolationError('Email already exists');
            }

            // Créez l'utilisateur en associant le rôle
            const user = AppDataSource.manager.create(User, {
                ...userData,
                role: role 
            });

            // Sauvegardez l'utilisateur
            return await AppDataSource.manager.save(user);

        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error; 
            }
            console.error("Error creating user:", error);
            throw new Error('An error occurred while creating the user'); 
        }
    }

    async updateUser(user_uuid: string, userData: CreateUserDTO): Promise<User | null> {
        try {
            // Si le role_uuid est présent, vérifiez si le rôle existe
            if (userData.role_uuid) {
                const role = await AppDataSource.manager.findOne(Role, { where: { role_uuid: userData.role_uuid } });
                if (!role) {
                    throw new EntityNotFoundError('Role', userData.role_uuid);
                }
                userData.role = role; // Associez le rôle trouvé
            }

            // Vérifiez si le username est déjà utilisé par un autre utilisateur
            if (userData.username) {
                const existingUserByUsername = await this.getUserByUsername(userData.username);
                if (existingUserByUsername && existingUserByUsername.user_uuid !== user_uuid) {
                    throw new UniqueConstraintViolationError('Username already exists');
                }
            }

            // Vérifiez si l'email est déjà utilisé par un autre utilisateur
            if (userData.email) {
                const existingUserByEmail = await AppDataSource.manager.findOne(User, { where: { email: userData.email } });
                if (existingUserByEmail && existingUserByEmail.user_uuid !== user_uuid) {
                    throw new UniqueConstraintViolationError('Email already exists');
                }
            }

            // Mettez à jour l'utilisateur
            await AppDataSource.manager.update(User, { user_uuid }, userData);
            return await this.getUserById(user_uuid);

        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error; 
            }
            console.error("Error updating user:", error);
            throw new Error('An error occurred while updating the user'); 
        }
    }

    async deleteUser(user_uuid: string): Promise<boolean> {
        try {
            const result = await AppDataSource.manager.delete(User, user_uuid);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    // Méthode auxiliaire pour vérifier si un rôle existe
    async verifyRole(role_uuid: string): Promise<boolean> {
        const role = await AppDataSource.manager.findOne(Role, { where: { role_uuid } });
        return !!role; 
    }
}
