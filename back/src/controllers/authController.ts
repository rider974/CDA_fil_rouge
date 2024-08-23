import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/services/authService";
import { UserService } from "@/services/userService";
import Joi from 'joi';

// Schema for validating comment creation and updates
const authentificationSchema = Joi.object({
  email: Joi.string().min(1).max(100).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).trim().required(),
  password: Joi.string().min(12).max(255).trim().required(),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    const userService = new UserService();
    this.authService = new AuthService(userService);
  }

  public async login(req: NextApiRequest, res: NextApiResponse) {
    try {

      const authentificationDataToDeserialize = JSON?.parse(req?.body);

      if(!authentificationDataToDeserialize?.email || !authentificationDataToDeserialize?.password )
      {
       return res.status(400).json({ error: "Veuillez renseigner un email et un mot de passe" });
      }
      
      const { error } = authentificationSchema?.validate(authentificationDataToDeserialize);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const user = await this.authService.login(authentificationDataToDeserialize);
      return res.status(200).json({ user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la connexion :", error.message);
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "Une erreur inconnue s'est produite" });
      }
    }
  }
}