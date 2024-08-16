import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    
    this.authService = authService;
  }

  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);
      res.status(200).json({ user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la connexion :", error.message);
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Une erreur inconnue s'est produite" });
      }
    }
  }
}