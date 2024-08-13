import { NextApiRequest, NextApiResponse } from "next";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";

// Initialisation du service utilisateur
const userService = new UserService(); 
const userController = new UserController(userService); 

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'POST':
                // Appelle la méthode login du contrôleur utilisateur pour gérer une requête POST.
                await userController.login(req, res);
                break;
            default:
                res.setHeader('Allow', ['POST']); 
                res.status(405).end(`Method ${req.method} Not Allowed`); 
                break;
        }
    } catch (error) {
        console.error("Error in authHandler:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
}