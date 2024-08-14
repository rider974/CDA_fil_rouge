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
      /**
       * @swagger
       * /api/have:
       *   get:
       *     description: Retrieve resources by tag UUID or tags by resource UUID
       *     parameters:
       *       - name: tag_uuid
       *         in: query
       *         description: UUID of the tag to retrieve associated resources
       *         required: false
       *         schema:
       *           type: string
       *       - name: ressource_uuid
       *         in: query
       *         description: UUID of the resource to retrieve associated tags
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of resources or tags based on the provided UUIDs
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 resources:
       *                   type: array
       *                   items:
       *                     type: object
       *                     properties:
       *                       uuid:
       *                         type: string
       *                       name:
       *                         type: string
       *                 tags:
       *                   type: array
       *                   items:
       *                     type: object
       *                     properties:
       *                       uuid:
       *                         type: string
       *                       name:
       *                         type: string
       *       400:
       *         description: Invalid GET request. Specify either tag_uuid or ressource_uuid.
       */
      case 'GET':
        if (req.query.tag_uuid) {
          return haveController.getResourcesByTag(req, res);
        }
        if (req.query.ressource_uuid) {
          return haveController.getTagsByResource(req, res);
        }
        return res.status(400).json({ error: "Invalid GET request. Specify either tag_uuid or ressource_uuid." });

      /**
       * @swagger
       * /api/have:
       *   post:
       *     description: Create an association between a tag and a resource
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               tag_uuid:
       *                 type: string
       *                 description: UUID of the tag
       *               ressource_uuid:
       *                 type: string
       *                 description: UUID of the resource
       *     responses:
       *       201:
       *         description: Association created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return haveController.createAssociation(req, res);

      /**
       * @swagger
       * /api/have:
       *   delete:
       *     description: Delete an association between a tag and a resource
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               tag_uuid:
       *                 type: string
       *                 description: UUID of the tag
       *               ressource_uuid:
       *                 type: string
       *                 description: UUID of the resource
       *     responses:
       *       204:
       *         description: Association deleted successfully
       *       400:
       *         description: Invalid input
       */
      case 'DELETE':
        return haveController.deleteAssociation(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle any errors during the request processing
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
