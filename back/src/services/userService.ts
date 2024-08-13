import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { Role } from "@/entity/role";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors"; 
import { Ressource } from "@/entity/ressource";

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
        try{
        return await AppDataSource.manager.find(User, {
            relations: [
                'role',
                'ressources',
                'comments',
                'sharingSessions',
                'following',
                'followers'
            ], 
        });
    }catch (error){
        console.error("Error fetching users:", error);
        throw new Error('An error occurred while fetching users');
     
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
                relations: [
                    'role',
                    'ressources',
                    'comments',
                    'sharingSessions',
                    'following',
                    'followers'
                ],
            });
        } catch (error) {
            console.error("Error fetching user by UUID:", error);
            throw new Error('An error occurred while fetching the user');
        }
    }

    /**
     * Fetch a user by their username.
     * @param username - The username of the user.
     * @returns The user if found, or null if not.
     */
    async getUserByUsername(username: string): Promise<User | null> {
        try {
            return await AppDataSource.manager.findOne(User, { where: { username } });
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

    /**
     * Replace an existing user with new data.
     * @param user_uuid - The UUID of the user to replace.
     * @param userData - The new data for the user.
     * @returns The updated user or null if not found.
     * @throws EntityNotFoundError if the user or role is not found.
     * @throws UniqueConstraintViolationError if the username or email already exists.
     */
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

    /**
     * Update specific fields of an existing user.
     * @param user_uuid - The UUID of the user to update.
     * @param userData - The partial data for the user.
     * @returns The updated user or null if not found.
     * @throws EntityNotFoundError if the user or role is not found.
     * @throws UniqueConstraintViolationError if the username or email already exists.
     */
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
    
    /**
     * Delete a user by their UUID.
     * @param user_uuid - The UUID of the user to delete.
     * @returns A boolean indicating if the user was successfully deleted.
     */
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
