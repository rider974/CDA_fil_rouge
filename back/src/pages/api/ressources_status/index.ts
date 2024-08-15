import type { NextApiRequest, NextApiResponse } from 'next';
import { RessourceStatusService } from '@/services/ressources_statusService';
import { RessourceStatusController } from '@/controllers/ressources_statusController';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';

// Initialize the service and controller for RessourceStatus
const ressourceStatusService = new RessourceStatusService();
const ressourceStatusController = new RessourceStatusController(ressourceStatusService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();
    await Cors(req, res, {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000',
    });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
 

    switch (req.method) {
       /**
       * @swagger
       * /api/ressources_status:
       *   get:
       *     description: Retrieve all ressource statuses or a specific status by UUID
       *     parameters:
       *       - name: ressource_status_uuid
       *         in: query
       *         description: UUID of the ressource status to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of ressource statuses or a specific status
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   ressource_status_uuid:
       *                     type: string
       *                     description: UUID of the ressource status
       *                   status:
       *                     type: string
       *                     description: Status value
       *       404:
       *         description: Ressource status not found
       */
      case 'GET':
        if (req.query.ressource_status_uuid) {
          return ressourceStatusController.getRessourceStatusById(req, res);
        } else {
          return ressourceStatusController.getAllRessourceStatuses(req, res);
        }

       /**
       * @swagger
       * /api/ressources_status:
       *   post:
       *     description: Create a new ressource status
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               status:
       *                 type: string
       *                 description: The status value
       *     responses:
       *       201:
       *         description: Ressource status created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return ressourceStatusController.createRessourceStatus(req, res);

       /**
       * @swagger
       * /api/ressources_status:
       *   put:
       *     description: Replace an existing ressource status by UUID
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_status_uuid:
       *                 type: string
       *                 description: UUID of the ressource status to replace
       *               status:
       *                 type: string
       *                 description: New status value
       *     responses:
       *       200:
       *         description: Ressource status replaced successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Ressource status not found
       */
      case 'PUT':
        return ressourceStatusController.replaceRessourceStatus(req, res);

       /**
       * @swagger
       * /api/ressources_status:
       *   delete:
       *     description: Delete a ressource status by UUID
       *     parameters:
       *       - name: ressource_status_uuid
       *         in: query
       *         description: UUID of the ressource status to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: Ressource status deleted successfully
       *       400:
       *         description: Invalid UUID
       *       404:
       *         description: Ressource status not found
       */
      case 'DELETE':
        return ressourceStatusController.deleteRessourceStatus(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
