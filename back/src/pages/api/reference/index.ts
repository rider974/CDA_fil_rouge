import type { NextApiRequest, NextApiResponse } from 'next';
import { ReferenceService } from '@/services/referenceServices';
import { ReferenceController } from '@/controllers/referenceController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

const referenceService = new ReferenceService();
const referenceController = new ReferenceController(referenceService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();

    await Cors(req, res, {
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000',
    });

    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    switch (req.method) {
       /**
       * @swagger
       * /api/reference:
       *   get:
       *     description: Retrieve sharing sessions by resource UUID or resources by sharing session UUID
       *     parameters:
       *       - name: ressource_uuid
       *         in: query
       *         description: UUID of the resource to retrieve sharing sessions for
       *         required: false
       *         schema:
       *           type: string
       *       - name: sharing_session_uuid
       *         in: query
       *         description: UUID of the sharing session to retrieve resources for
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of sharing sessions or resources based on the provided UUIDs
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
       *                 resources:
       *                   type: array
       *                   items:
       *                     type: object
       *                     properties:
       *                       uuid:
       *                         type: string
       *                       name:
       *                         type: string
       *       400:
       *         description: Missing resource or sharing session UUID
       */
      case 'GET':
        if (req.query.ressource_uuid) {
          return referenceController.getSharingSessionsByRessource(req, res);
        } else if (req.query.sharing_session_uuid) {
          return referenceController.getRessourcesBySharingSession(req, res);
        } else {
          res.status(400).json({ error: "Missing resource or sharing session UUID" });
        }
        break;

       /**
       * @swagger
       * /api/reference:
       *   post:
       *     description: Create an association between a resource and a sharing session
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_uuid:
       *                 type: string
       *                 description: UUID of the resource
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
        return referenceController.createAssociation(req, res);

       /**
       * @swagger
       * /api/reference:
       *   delete:
       *     description: Delete an association between a resource and a sharing session
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_uuid:
       *                 type: string
       *                 description: UUID of the resource
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
        return referenceController.deleteAssociation(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
