import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from "../../../data-source";
import { UserController } from "@/controllers/userController";
import { UserService } from "@/services/userService";
import Cors from 'nextjs-cors';

const userService = new UserService();
const userController = new UserController(userService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try{
  await initializeDataSource();
  await Cors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    origin: 'http://localhost:3000'
  });

  const action = req.query.action as string | undefined;

  switch (req.method) {
    case "POST":
      await userController.createUser(req, res);
      break;
    
    case "GET":
      if (req.query.user_uuid) {
        await userController.getUserById(req, res);
      } else if (req.query.username) {
        await userController.getUserByUsername(req, res);
      } else {
        await userController.getAllUsers(req, res);
      }
      break;

    case "PUT":
        await userController.replaceUser(req, res);
        return;  

       /**
       * @swagger
       * /api/users:
       *   patch:
       *     summary: Update user fields or toggle user active status
       *     tags:
       *       - Users
       *     parameters:
       *       - name: action
       *         in: query
       *         description: The action to perform (e.g., toggleActiveStatus)
       *         required: true
       *         schema:
       *           type: string
       *           example: "toggleActiveStatus"
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               user_uuid:
       *                 type: string
       *                 description: The UUID of the user to update
       *                 example: "123e4567-e89b-12d3-a456-426614174000"
       *               is_active:
       *                 type: boolean
       *                 description: The active status to set (only for toggleActiveStatus action)
       *                 example: true
       *               username:
       *                 type: string
       *                 description: The new username
       *                 example: "updatedusername"
       *               email:
       *                 type: string
       *                 description: The new email
       *                 example: "updatedemail@example.com"
       *               password:
       *                 type: string
       *                 description: The new password
       *                 example: "UpdatedPassword123!@#"
       *               role_uuid:
       *                 type: string
       *                 description: The UUID of the new role
       *                 example: "role-uuid-5678"
       *     responses:
       *       200:
       *         description: User updated successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: User not found
       */
      case "PATCH":
        if (action === 'toggleActiveStatus') {
          if (!req.query.user_uuid || typeof req.body.is_active !== 'boolean') {
            return res.status(400).json({ error: "Invalid input" });
          }
          await userController.toggleUserActiveStatus(req, res);
        } else {
          if (!req.query.user_uuid) {
            return res.status(400).json({ error: "User UUID is required for update" });
          }
          await userController.updateUserPatch(req, res);
        }
        break;

    case "DELETE":
      if (!req.query.user_uuid) {
        return res.status(400).json({ error: "User UUID is required for deletion" });
      }
      await userController.deleteUser(req, res);
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
  }
} catch (error) {
  console.error("Handler error:", error);
  res.status(500).json({ error: "Internal server error" });
}
}
