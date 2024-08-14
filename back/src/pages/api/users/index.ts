import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from '../../../data-source';
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

  // Remove the X-Powered-By header to hide Next.js usage
  res.removeHeader('X-Powered-By');

  // Set additional security headers (Helmet-like)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');



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