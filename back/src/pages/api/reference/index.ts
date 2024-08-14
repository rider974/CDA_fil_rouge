import type { NextApiRequest, NextApiResponse } from 'next';
import { ReferenceService } from '@/services/referenceServices';
import { ReferenceController } from '@/controllers/referenceController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

// Initialize the service and controller
const referenceService = new ReferenceService();
const referenceController = new ReferenceController(referenceService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the database connection
    await initializeDataSource();

    // Set up CORS
    await Cors(req, res, {
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000',
    });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Handle the request based on the method
    switch (req.method) {
      case 'GET':
        // Check if the request is for all sharing sessions by resource or all resources by sharing session
        if (req.query.ressource_uuid) {
          return referenceController.getSharingSessionsByRessource(req, res);
        } else if (req.query.sharing_session_uuid) {
          return referenceController.getRessourcesBySharingSession(req, res);
        } else {
          res.status(400).json({ error: "Missing resource or sharing session UUID" });
        }
        break;
      case 'POST':
        return referenceController.createAssociation(req, res);
      case 'DELETE':
        return referenceController.deleteAssociation(req, res);
      default:
        // If the HTTP method is not supported
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
