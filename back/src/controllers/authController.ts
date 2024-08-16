import { NextApiRequest, NextApiResponse } from "next";
import { sanitize } from "sanitizer";
import { UserService } from "@/services/userService";
import Joi from "joi";
import { hashPassword, comparePassword } from "../utils/authUtils";

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export class AuthController {

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

   /**
   * Sanitizes input strings to remove potential harmful content.
   * @param input - The input string to sanitize.
   * @returns The sanitized string.
   */
   private sanitizeInput(input: string): string {
    return sanitize(input.trim());
  }

  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { email, password } = req.body;
  
      // Validate the login schema
      const { error } = userLoginSchema.validate({ email, password });
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const sanitizedEmail = this.sanitizeInput(email);
      const user = await this.userService.getUserByEmail(sanitizedEmail);
  
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // If authentication is successful, return user information
      return res.status(200).json({
        id: user.user_uuid,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
}