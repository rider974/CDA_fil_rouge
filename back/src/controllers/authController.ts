import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Gère la connexion de l'utilisateur.
   * @param req - La requête HTTP Next.js.
   * @param res - La réponse HTTP Next.js.
   */
  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);

      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la connexion :", error.message);
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Une erreur inconnue s'est produite" });
      }
    }
  }

  /**
   * Gère l'inscription d'un nouvel utilisateur.
   * @param req - La requête HTTP Next.js.
   * @param res - La réponse HTTP Next.js.
   */
  async register(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { username, email, password, roleUuid } = req.body;
      const newUser = await this.authService.register(username, email, password, roleUuid);

      res.status(201).json(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de l'inscription :", error.message);
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Une erreur inconnue s'est produite" });
      }
    }
  }

  /**
   * Gère la réinitialisation du mot de passe de l'utilisateur.
   * @param req - La requête HTTP Next.js.
   * @param res - La réponse HTTP Next.js.
   */
  async resetPassword(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { email, newPassword } = req.body;
      const updatedUser = await this.authService.resetPassword(email, newPassword);

      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la réinitialisation du mot de passe :", error.message);
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Une erreur inconnue s'est produite" });
      }
    }
  }

  // Ajoutez d'autres méthodes liées à l'authentification si nécessaire
}