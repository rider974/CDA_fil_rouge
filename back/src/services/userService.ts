import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { Role } from "@/entity/role";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors"; 

interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
    is_active: boolean; 
    role: Role;
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

    async getRoleById(role_uuid: string): Promise<Role | null> {
        return await AppDataSource.manager.findOne(Role, { where: { role_uuid } });
    }

    async createUser(userData: CreateUserDTO): Promise<User> {
        try {
            const role = await this.getRoleById(userData.role.role_uuid);
            if (!role) {
                throw new EntityNotFoundError('Role', userData.role.role_uuid);
            }
    
            const existingUserByUsername = await this.getUserByUsername(userData.username);
            if (existingUserByUsername) {
                throw new UniqueConstraintViolationError('Username already exists');
            }
    
            const existingUserByEmail = await AppDataSource.manager.findOne(User, { where: { email: userData.email } });
            if (existingUserByEmail) {
                throw new UniqueConstraintViolationError('Email already exists');
            }
    
            const user = AppDataSource.manager.create(User, {
                ...userData,
                role 
            });
    
            return await AppDataSource.manager.save(user);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error; 
            }
            console.error("Error creating user:", error);
            throw new Error('An error occurred while creating the user'); 
        }
    }

    async replaceUser(user_uuid: string, userData: CreateUserDTO): Promise<User | null> {
        try {
            const existingUser = await this.getUserById(user_uuid);
            if (!existingUser) {
                throw new EntityNotFoundError('User', user_uuid);
            }
    
            const role = await this.getRoleById(userData.role.role_uuid);
            if (!role) {
                throw new EntityNotFoundError('Role', userData.role.role_uuid);
            }
    
            const updatedUser = await AppDataSource.manager.save(User, { ...existingUser, ...userData, role });
            return updatedUser;
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error replacing user:", error);
            throw new Error('An error occurred while replacing the user');
        }
    }

    async updateUserFields(user_uuid: string, userData: Partial<User>): Promise<User | null> {
        try {
            const existingUser = await this.getUserById(user_uuid);
            if (!existingUser) {
                throw new EntityNotFoundError('User', user_uuid);
            }

            if (userData.role && userData.role.role_uuid) {
                const role = await this.getRoleById(userData.role.role_uuid);
                if (!role) {
                    throw new EntityNotFoundError('Role', userData.role.role_uuid);
                }
                userData.role = role;
            }

            if (userData.username) {
                const existingUserByUsername = await this.getUserByUsername(userData.username);
                if (existingUserByUsername && existingUserByUsername.user_uuid !== user_uuid) {
                    throw new UniqueConstraintViolationError('Username already exists');
                }
            }

            if (userData.email) {
                const existingUserByEmail = await AppDataSource.manager.findOne(User, { where: { email: userData.email } });
                if (existingUserByEmail && existingUserByEmail.user_uuid !== user_uuid) {
                    throw new UniqueConstraintViolationError('Email already exists');
                }
            }

            await AppDataSource.manager.update(User, { user_uuid }, userData);
            return await this.getUserById(user_uuid);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error updating user fields:", error);
            throw new Error('An error occurred while updating the user fields');
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

}
