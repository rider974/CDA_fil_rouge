import type { NextApiRequest, NextApiResponse } from 'next';
import { ReferService } from '@/services/referServices';
import { ReferController } from '@/controllers/referControllers';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';

// Initialize the services and controllers
const referService = new ReferService();
const referController = new ReferController(referService);

// The main API handler for the 'refer' routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the data source (database connection)
    await initializeDataSource();

    // Enable CORS for cross-origin requests
    await Cors(req, res, {
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000', // Adjust the origin as needed
    });

    // Determine the HTTP method and route accordingly
    switch (req.method) {
      case 'GET':
        // If there's a query for `tag_uuid`, return the sharing sessions associated with the tag
        if (req.query.tag_uuid) {
          return referController.getSharingSessionsByTag(req, res);
        }
        // If there's a query for `sharing_session_uuid`, return the tags associated with the sharing session
        if (req.query.sharing_session_uuid) {
          return referController.getTagsBySharingSession(req, res);
        }
        return res.status(400).json({ error: "Invalid GET request. Specify either tag_uuid or sharing_session_uuid." });

      case 'POST':
        // Handle requests to create a tag-sharing session association
        return referController.createAssociation(req, res);

      case 'DELETE':
        // Handle requests to delete a tag-sharing session association
        return referController.deleteAssociation(req, res);

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
