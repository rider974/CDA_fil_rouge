import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);

      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during login:", error.message);
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }

  // Ajoutez d'autres méthodes liées à l'authentification si nécessaire
}