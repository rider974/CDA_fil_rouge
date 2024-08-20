import type { NextApiRequest, NextApiResponse } from 'next';
import { ReferService } from '@/services/referServices';
import { ReferController } from '@/controllers/referControllers';
import { initializeDataSource } from '@/data-source';
import { corsMiddleware } from '@/utils/corsMiddleware';

// Initialize the services and controllers
const referService = new ReferService();
const referController = new ReferController(referService);

// The main API handler for the 'refer' routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the data source (database connection)
    await initializeDataSource();

    // Enable CORS for cross-origin requests
    await corsMiddleware(req, res);

    // Remove the X-Powered-By header to hide Next.js usage
     res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Determine the HTTP method and route accordingly
    switch (req.method) {
       /**
       * @swagger
       * /api/refer:
       *   get:
       *     description: Retrieve sharing sessions by tag UUID or tags by sharing session UUID
       *     tags:
       *       - refer
       *     parameters:
       *       - name: tag_uuid
       *         in: query
       *         description: UUID of the tag to retrieve associated sharing sessions
       *         required: false
       *         schema:
       *           type: string
       *       - name: sharing_session_uuid
       *         in: query
       *         description: UUID of the sharing session to retrieve associated tags
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of sharing sessions or tags based on the provided UUIDs
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 sharingSessions:
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
       *         description: Invalid GET request. Specify either tag_uuid or sharing_session_uuid.
       */
      case 'GET':
        if (req.query.tag_uuid) {
          return referController.getSharingSessionsByTag(req, res);
        }
        if (req.query.sharing_session_uuid) {
          return referController.getTagsBySharingSession(req, res);
        }
        return res.status(400).json({ error: "Invalid GET request. Specify either tag_uuid or sharing_session_uuid." });

       /**
       * @swagger
       * /api/refer:
       *   post:
       *     description: Create an association between a tag and a sharing session
       *     tags:
       *       - refer
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
       *               sharing_session_uuid:
       *                 type: string
       *                 description: UUID of the sharing session
       *     responses:
       *       201:
       *         description: Association created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return referController.createAssociation(req, res);

       /**
       * @swagger
       * /api/refer:
       *   delete:
       *     description: Delete an association between a tag and a sharing session
       *     tags:
       *       - refer
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
       *               sharing_session_uuid:
       *                 type: string
       *                 description: UUID of the sharing session
       *     responses:
       *       204:
       *         description: Association deleted successfully
       *       400:
       *         description: Invalid input
       */
      case 'DELETE':
        return referController.deleteAssociation(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
