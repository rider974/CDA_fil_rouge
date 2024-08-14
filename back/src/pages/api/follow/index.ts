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

    // Determine the HTTP method and route accordingly
    switch (req.method) {
      case 'GET':
        // If there's a query for `user_uuid`, return the user's followers
        if (req.query.user_uuid) {
          return followController.getFollowers(req, res);
        }
        // If there's a query for `follower_uuid`, return the users that the user is following
        if (req.query.follower_uuid) {
          return followController.getFollowing(req, res);
        }
        return res.status(400).json({ error: "Invalid GET request. Specify either user_uuid or follower_uuid." });

      case 'POST':
        // Handle requests to follow a user
        return followController.followUser(req, res);

      case 'DELETE':
        // Handle requests to unfollow a user
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
