import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import { sanitize } from 'sanitizer';
import { EntityNotFoundError } from "@/errors/errors";
import { generateJwtToken } from "@/utils/generateToken";
import { initializeDataSource } from '@/data-source';
import Cors from 'cors';
import { UserService } from "@/services/userService";

// Initialize the services and controllers
const userService = new UserService();

// Define validation schema for user login
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string()
    .min(12)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[0-9]/, "digit")
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special character")
    .required()
    .messages({
      "string.min": "Password must be at least 12 characters long",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character",
      "string.empty": "Password is required",
    }),
});

// Secret key for signing the JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// Middleware to enable CORS
function runCorsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    Cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000', 
    })(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

/**
 * @swagger
 * /api/auth/generateToken:
 *   post:
 *     summary: Generate a JWT token
 *     description: Authenticate a user using email and password, and return a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *                 example: "Password123!@#"
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The generated JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating what went wrong
 *                   example: "Email is required"
 *       401:
 *         description: Authentication failed due to invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating what went wrong
 *                   example: "Invalid email or password"
 *       405:
 *         description: Method Not Allowed
 *       500:
 *         description: Internal server error
 */
export default async function generateToken(req: NextApiRequest, res: NextApiResponse) {
  // Initialize the database connection
  await initializeDataSource();

  // Run CORS middleware
  await runCorsMiddleware(req, res);

  // Remove the X-Powered-By header to improve security
  res.removeHeader('X-Powered-By');

  // Set additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate the input data
    const { error } = userLoginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Sanitize the email to prevent injection attacks
    const sanitizedEmail = sanitize(email);

    // Simulate user login via a service
    const user = await userService.login(sanitizedEmail, password);

    // Generate the JWT token
    const token = generateJwtToken({
      id: user.user_uuid,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Return the token to the client
    return res.status(200).json({
      token, 
    });
  } catch (error) {
    // Handle specific error types
    if (error instanceof EntityNotFoundError) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
