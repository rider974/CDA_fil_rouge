import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';
import { AuthController } from '@/controllers/authController'
import { UserService } from '@/services/userService';
// Initialize the services and controllers
const userService = new UserService();
const authController = new AuthController(userService);


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
        //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Determine the HTTP method and route accordingly
        switch (req.method) {


            case 'POST':

                return authController.login(req, res)
            default:
                // If the method is not allowed, return a 405 Method Not Allowed response
                res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        // Handle any errors during the request processing
        console.error("Handler error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
