import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';
import { UserService } from '@/services/userService';
import { UserController } from '@/controllers/userController';

// Initialize the services and controllers
const userService = new UserService();
const userController = new UserController(userService);

// The main API handler for the follow routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Initialize the data source (database connection)
        await initializeDataSource();

        // Enable CORS for cross-origin requests
        await Cors(req, res, {
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            origin: 'http://localhost:3000', // Adjust the origin as needed
        });

        // Remove the X-Powered-By header to hide Next.js usage
        res.removeHeader('X-Powered-By');

        // Set additional security headers (Helmet-like)
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Determine the HTTP method and route accordingly
        switch (req.method) {
            /**
             * @swagger
             * /api/users/login:
             *   post:
             *     description: Authenticate a user with email and password
             *     tags:
             *       - users
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 description: The user's email address
             *               password:
             *                 type: string
             *                 description: The user's password
             *             required:
             *               - email
             *               - password
             *     responses:
             *       200:
             *         description: User authenticated successfully
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 id:
             *                   type: string
             *                 username:
             *                   type: string
             *                 email:
             *                   type: string
             *                 role:
             *                   type: string
             *       400:
             *         description: Invalid input
             *       401:
             *         description: Invalid email or password
             *       500:
             *         description: Internal server error
             */
            case 'POST':
                return userController.login(req, res);

            default:
                // If the method is not allowed, return a 405 Method Not Allowed response
                res.setHeader('Allow', ['POST']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        // Handle any errors during the request processing
        console.error("Handler error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
