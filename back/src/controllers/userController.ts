// controllers/userController.ts
import { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../services/userService";




export class UserController {
  private userService = new UserService();

  async createUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      if (!req.body.role_uuid) {
        res.status(400).json({ error: "role_uuid is required" });
        return;
      }

      const newUser = await this.userService.createUser(req.body);
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
      const { user_uuid } = req.query;
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
      const { username } = req.query;
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
      const { user_uuid } = req.query;
      if (typeof user_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid user UUID" });
      }

      if (req.body.role_uuid) {
        // Vérifiez si le rôle existe avant de mettre à jour l'utilisateur
        const roleExists = await this.userService.verifyRole(req.body.role_uuid);
        console.log('test sur roleExists ' + roleExists);
        if (!roleExists) {
          return res.status(404).json({ error: "Role not found" });
        }
      }

      const updatedUser = await this.userService.updateUser(user_uuid, req.body);
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

  
  async updateUserPut(req: NextApiRequest, res: NextApiResponse) {
    try {
      console.log(req.body);

      if(!req.body.username || !req.body.email || !req.body.password || !req.body.is_active || !req.body.role){

        return res.status(400).json({ error: "tout les champs sont requis" });
      }

      if (typeof req.body.user_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid user UUID" });
      }

      if (req.body.role_uuid) {
        // Vérifiez si le rôle existe avant de mettre à jour l'utilisateur
        const roleExists = await this.userService.verifyRole(req.body.role_uuid);
        console.log('test sur roleExists ' + roleExists);
        if (!roleExists) {
          return res.status(404).json({ error: "Role not found" });
        }
      }

      const updatedUser = await this.userService.updateUser(req.body.user_uuid, req.body);
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
      const { user_uuid } = req.query;
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
