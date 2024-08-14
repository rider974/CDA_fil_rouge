import type { NextApiRequest, NextApiResponse } from 'next';
import { RessourceService } from '@/services/ressourceService';
import { RessourceController } from '@/controllers/ressourcesController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

const ressourceService = new RessourceService();
const ressourceController = new RessourceController(ressourceService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();
    await Cors(req, res, {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000'
    });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    switch (req.method) {
      /**
       * @swagger
       * /api/ressource:
       *   get:
       *     description: Retrieve all ressources or a specific ressource by UUID
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
       * /api/ressource:
       *   post:
       *     description: Create a new ressource
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
       * /api/ressource:
       *   put:
       *     description: Replace an existing ressource by UUID
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
       * /api/ressource:
       *   delete:
       *     description: Delete a ressource by UUID
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
