import type { NextApiRequest, NextApiResponse } from 'next';
import { RessourceService } from '@/services/ressourceService';
import { RessourceController } from '@/controllers/ressourcesController';
import { initializeDataSource } from '../../../data-source';
import { corsMiddleware } from '@/utils/corsMiddleware';

const ressourceService = new RessourceService();
const ressourceController = new RessourceController(ressourceService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();
    await corsMiddleware(req, res);

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    switch (req.method) {
       /**
       * @swagger
       * /api/ressources:
       *   get:
       *     description: Retrieve all ressources or a specific ressource by UUID
       *     tags:
       *       - ressources
       *     parameters:
       *       - name: ressource_uuid
       *         in: query
       *         description: UUID of the ressource to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of ressources or a specific ressource
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   ressource_uuid:
       *                     type: string
       *                     description: UUID of the ressource
       *                   name:
       *                     type: string
       *                     description: Name of the ressource
       *       404:
       *         description: Ressource not found
       */
      case 'GET':
        if (req.query.ressource_uuid) {
          return ressourceController.getRessourceById(req, res);
        } else {
          return ressourceController.getAllRessources(req, res);
        }

       /**
       * @swagger
       * /api/ressources:
       *   post:
       *     description: Create a new ressource
       *     tags:
       *       - ressources
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               name:
       *                 type: string
       *                 description: The name of the ressource
       *     responses:
       *       201:
       *         description: Ressource created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return ressourceController.createRessource(req, res);

       /**
       * @swagger
       * /api/ressources:
       *   put:
       *     description: Replace an existing ressource by UUID
       *     tags:
       *       - ressources
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_uuid:
       *                 type: string
       *                 description: UUID of the ressource to replace
       *               name:
       *                 type: string
       *                 description: New name for the ressource
       *     responses:
       *       200:
       *         description: Ressource replaced successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Ressource not found
       */
      case 'PUT':
        return ressourceController.replaceRessource(req, res);

       /**
       * @swagger
       * /api/ressources:
       *   patch:
       *     description: Update the status of an existing ressource by UUID
       *     tags:
       *       - ressources
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_uuid:
       *                 type: string
       *                 description: UUID of the ressource to update
       *                 example: "aca10f08-9076-45ed-9619-d05e25d0cf79"
       *               newStatusUuid:
       *                 type: string
       *                 description: UUID of the new status for the ressource
       *                 example: "73292f30-7cb1-4c14-81d0-cd570826a859"
       *     responses:
       *       200:
       *         description: Ressource status updated successfully
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 ressource_uuid:
       *                   type: string
       *                   description: UUID of the updated ressource
       *                 ressourceStatus:
       *                   type: object
       *                   properties:
       *                     ressource_status_uuid:
       *                       type: string
       *                       description: UUID of the new status
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Ressource or status not found
       */

      case 'PATCH':
        return ressourceController.updateRessourceStatus(req, res);

       /**
       * @swagger
       * /api/ressources:
       *   delete:
       *     description: Delete a ressource by UUID
       *     tags:
       *       - ressources
       *     parameters:
       *       - name: ressource_uuid
       *         in: query
       *         description: UUID of the ressource to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: Ressource deleted successfully
       *       400:
       *         description: Invalid UUID
       *       404:
       *         description: Ressource not found
       */
      
      case 'DELETE':
        return ressourceController.deleteRessource(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
