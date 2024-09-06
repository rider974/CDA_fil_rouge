import type { NextApiRequest, NextApiResponse } from 'next';
import { RessourceStatusHistoryService } from '@/services/ressources_status_historyService';
import { RessourceStatusHistoryController } from '@/controllers/ressources_status_historyController';
import { initializeDataSource } from '../../../data-source';
import { corsMiddleware } from '@/utils/corsMiddleware';
import { authenticateToken } from '@/utils/verifToken';

// Initialize the service and controller
const statusHistoryService = new RessourceStatusHistoryService();
const statusHistoryController = new RessourceStatusHistoryController(statusHistoryService);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the database connection
    await initializeDataSource();

    // Set up CORS
    await corsMiddleware(req, res);

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
   

    // Handle the request based on the method
    switch (req.method) {
       /**
       * @swagger
       * /api/ressources_status_history:
       *   get:
       *     description: Retrieve all status history entries or a specific entry by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_status_history
       *     parameters:
       *       - name: ressource_status_history_uuid
       *         in: query
       *         description: UUID of the status history entry to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of status history entries or a specific entry
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   ressource_status_history_uuid:
       *                     type: string
       *                     description: UUID of the status history entry
       *                   status:
       *                     type: string
       *                     description: Status value
       *                   timestamp:
       *                     type: string
       *                     format: date-time
       *                     description: Time when the status was recorded
       *       404:
       *         description: Status history entry not found
       */
      case 'GET':
        if (req.query.ressource_status_history_uuid) {
          return statusHistoryController.getStatusHistoryById(req, res);
        } else {
          return statusHistoryController.getAllStatusHistories(req, res);
        }

       /**
       * @swagger
       * /api/ressources_status_history:
       *   post:
       *     description: Create a new status history entry
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_status_history
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
       *               timestamp:
       *                 type: string
       *                 format: date-time
       *                 description: Time when the status was recorded
       *     responses:
       *       201:
       *         description: Status history entry created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return statusHistoryController.createStatusHistory(req, res);

       /**
       * @swagger
       * /api/ressources_status_history:
       *   put:
       *     description: Replace an existing status history entry by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_status_history
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_status_history_uuid:
       *                 type: string
       *                 description: UUID of the status history entry to replace
       *               status:
       *                 type: string
       *                 description: New status value
       *               timestamp:
       *                 type: string
       *                 format: date-time
       *                 description: New time when the status was recorded
       *     responses:
       *       200:
       *         description: Status history entry replaced successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Status history entry not found
       */
      case 'PUT':
        return statusHistoryController.replaceStatusHistory(req, res);

       /**
       * @swagger
       * /api/ressources_status_history:
       *   patch:
       *     description: Update specific fields of an existing status history entry by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_status_history
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_status_history_uuid:
       *                 type: string
       *                 description: UUID of the status history entry to update
       *               status:
       *                 type: string
       *                 description: New status value (optional)
       *               timestamp:
       *                 type: string
       *                 format: date-time
       *                 description: New time when the status was recorded (optional)
       *     responses:
       *       200:
       *         description: Status history entry updated successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Status history entry not found
       */
      case 'PATCH':
        return statusHistoryController.updateStatusHistoryFields(req, res);

       /**
       * @swagger
       * /api/ressources_status_history:
       *   delete:
       *     description: Delete a status history entry by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_status_history
       *     parameters:
       *       - name: ressource_status_history_uuid
       *         in: query
       *         description: UUID of the status history entry to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: Status history entry deleted successfully
       *       400:
       *         description: Invalid UUID
       *       404:
       *         description: Status history entry not found
       */
      case 'DELETE':
        return statusHistoryController.deleteStatusHistory(req, res);

      default:
        // If the HTTP method is not supported
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default authenticateToken(handler)
