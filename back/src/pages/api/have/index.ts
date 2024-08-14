import type { NextApiRequest, NextApiResponse } from 'next';
import { HaveService } from '@/services/haveServices';
import { HaveController } from '@/controllers/haveController';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';

// Initialize the services and controllers
const haveService = new HaveService();
const haveController = new HaveController(haveService);

// The main API handler for the 'have' routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the data source (database connection)
    await initializeDataSource();

    // Enable CORS for cross-origin requests
    await Cors(req, res, {
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000', // Adjust the origin as needed
    });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');


    // Determine the HTTP method and route accordingly
    switch (req.method) {
      case 'GET':
        // If there's a query for `tag_uuid`, return the resources associated with the tag
        if (req.query.tag_uuid) {
          return haveController.getResourcesByTag(req, res);
        }
        // If there's a query for `ressource_uuid`, return the tags associated with the resource
        if (req.query.ressource_uuid) {
          return haveController.getTagsByResource(req, res);
        }
        return res.status(400).json({ error: "Invalid GET request. Specify either tag_uuid or ressource_uuid." });

      case 'POST':
        // Handle requests to create a tag-resource association
        return haveController.createAssociation(req, res);

      case 'DELETE':
        // Handle requests to delete a tag-resource association
        return haveController.deleteAssociation(req, res);

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
