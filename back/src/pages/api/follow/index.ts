import type { NextApiRequest, NextApiResponse } from 'next';
import { FollowService } from '@/services/followServices';
import { FollowController } from '@/controllers/followController';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';

// Initialize the services and controllers
const followService = new FollowService();
const followController = new FollowController(followService);

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
      /**
       * @swagger
       * /api/follow:
       *   get:
       *     description: Retrieve followers of a user or users followed by a user
       *     parameters:
       *       - name: user_uuid
       *         in: query
       *         description: UUID of the user to retrieve their followers
       *         required: true
       *         schema:
       *           type: string
       *       - name: follower_uuid
       *         in: query
       *         description: UUID of the user to retrieve the users they are following
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of followers or users being followed
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 followers:
       *                   type: array
       *                   items:
       *                     type: object
       *                     properties:
       *                       uuid:
       *                         type: string
       *                       name:
       *                         type: string
       *                 following:
       *                   type: array
       *                   items:
       *                     type: object
       *                     properties:
       *                       uuid:
       *                         type: string
       *                       name:
       *                         type: string
       *       400:
       *         description: Invalid GET request. Specify either user_uuid or follower_uuid.
       */
      case 'GET':
        if (req.query.user_uuid) {
          return followController.getFollowers(req, res);
        }
        if (req.query.follower_uuid) {
          return followController.getFollowing(req, res);
        }
        return res.status(400).json({ error: "Invalid GET request. Specify either user_uuid or follower_uuid." });

      /**
       * @swagger
       * /api/follow:
       *   post:
       *     description: Follow a user
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               user_uuid:
       *                 type: string
       *                 description: UUID of the user to follow
       *               follower_uuid:
       *                 type: string
       *                 description: UUID of the follower
       *     responses:
       *       201:
       *         description: User followed successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return followController.followUser(req, res);

      /**
       * @swagger
       * /api/follow:
       *   delete:
       *     description: Unfollow a user
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               user_uuid:
       *                 type: string
       *                 description: UUID of the user to unfollow
       *               follower_uuid:
       *                 type: string
       *                 description: UUID of the follower
       *     responses:
       *       204:
       *         description: User unfollowed successfully
       *       400:
       *         description: Invalid input
       */
      case 'DELETE':
        return followController.unfollowUser(req, res);

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
