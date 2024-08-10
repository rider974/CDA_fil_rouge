// controllers/userController.ts
import { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../services/userService";
import { sanitize } from 'sanitizer';
import { hashPassword } from '../utils/authUtils';
import Joi from 'joi';

const userSchema = Joi.object({
  role_uuid: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  is_active: Joi.boolean().required(),
});


export class UserController {
  private userService = new UserService();

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeInput(input: string): string {
    return sanitize(input.trim());
  }

  async createUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { error } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { role_uuid, username, email, password, is_active } = req.body;

      const role = await this.userService.getRoleById(role_uuid);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await this.userService.createUser({
        role,
        username: this.sanitizeInput(username),
        email: this.sanitizeInput(email),
        password: hashedPassword,
        is_active
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  }

  async getAllUsers(req: NextApiRequest, res: NextApiResponse) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }

  async getUserById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user_uuid = this.sanitizeInput(req.query.user_uuid as string);
      if (typeof user_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid user UUID" });
      }

      const user = await this.userService.getUserById(user_uuid);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user by UUID:", error);
      res.status(500).json({ error: "Error fetching user by UUID" });
    }
  }

  async getUserByUsername(req: NextApiRequest, res: NextApiResponse) {
    try {
      const username = this.sanitizeInput(req.query.username as string);
      if (typeof username !== 'string') {
        return res.status(400).json({ error: "Invalid username" });
      }

      const user = await this.userService.getUserByUsername(username);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "Username not found" });
      }
    } catch (error) {
      console.error("Error fetching user by username:", error);
      res.status(500).json({ error: "Error fetching user by username" });
    }
  }

  async updateUserPatch(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user_uuid = this.sanitizeInput(req.query.user_uuid as string);
      const { role_uuid, username, email, password } = req.body;

      if (typeof user_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid user UUID" });
      }

      if (role_uuid) {
        const roleExists = await this.userService.getRoleById(role_uuid);
        if (!roleExists) {
          return res.status(404).json({ error: "Role not found" });
        }
      }

      const updatedFields: any = {};
      if (username) updatedFields.username = this.sanitizeInput(username);
      if (email) updatedFields.email = this.sanitizeInput(email);
      if (password) updatedFields.password = await hashPassword(password);

      const updatedUser = await this.userService.updateUserFields(user_uuid, updatedFields);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error updating user" });
    }
  }

  async replaceUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user_uuid = this.sanitizeInput(req.query.user_uuid as string);
      const { username, email, password, is_active, role } = req.body;

      if (!user_uuid || typeof user_uuid !== 'string') {
        return res.status(400).json({ error: "User UUID is required and must be a string" });
      }

      if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: "username is required and must be a string" });
      }
      if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
        return res.status(400).json({ error: "A valid email is required" });
      }
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: "password is required and must be a string" });
      }
      if (typeof is_active !== 'boolean') {
        return res.status(400).json({ error: "is_active is required and must be a boolean" });
      }

      if (role?.role_uuid) {
        const roleExists = await this.userService.getRoleById(role.role_uuid);
        if (!roleExists) {
          return res.status(404).json({ error: "Role not found" });
        }
      }

      const hashedPassword = await hashPassword(password);

      const updatedUser = await this.userService.replaceUser(user_uuid, {
        username: this.sanitizeInput(username),
        email: this.sanitizeInput(email),
        password: hashedPassword,
        is_active,
        role
      });
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error updating user" });
    }
  }

  async deleteUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user_uuid = this.sanitizeInput(req.query.user_uuid as string);
      if (typeof user_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid user UUID" });
      }

      const success = await this.userService.deleteUser(user_uuid);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error deleting user" });
    }
  }
}
