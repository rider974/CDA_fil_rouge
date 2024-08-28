import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from '@/data-source';
import { Ressources_typesController } from "@/controllers/ressources_typesController";
import { Ressources_typesService } from "@/services/ressources_typesService";
import { corsMiddleware } from "@/utils/corsMiddleware";
import { authenticateToken } from "@/utils/verifToken";

const ressources_typesService = new Ressources_typesService();
const ressources_typesController = new Ressources_typesController(ressources_typesService);

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
       * /api/ressources_types:
       *   get:
       *     description: Retrieve all resource types or a specific resource type by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_types
       *     parameters:
       *       - name: ressource_type_uuid
       *         in: query
       *         description: UUID of the resource type to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of resource types or a specific resource type
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   ressource_type_uuid:
       *                     type: string
       *                     description: UUID of the resource type
       *                   name:
       *                     type: string
       *                     description: Name of the resource type
       *                   description:
       *                     type: string
       *                     description: Description of the resource type
       *       404:
       *         description: Resource type not found
       */
      case "GET":
        if (req.query.ressource_type_uuid) {
          await ressources_typesController.getRessources_typesById(req, res);
        } else {
          await ressources_typesController.getAllRessources_types(req, res);
        }
        break;

       /**
       * @swagger
       * /api/ressources_types:
       *   post:
       *     description: Create a new resource type
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_types
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               name:
       *                 type: string
       *                 description: The name of the resource type
       *               description:
       *                 type: string
       *                 description: Description of the resource type
       *     responses:
       *       201:
       *         description: Resource type created successfully
       *       400:
       *         description: Invalid input
       */
      case "POST":
        await ressources_typesController.createRessources_types(req, res);
        break;

       /**
       * @swagger
       * /api/ressources_types:
       *   patch:
       *     description: Update an existing resource type by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_types
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               ressource_type_uuid:
       *                 type: string
       *                 description: UUID of the resource type to update
       *               name:
       *                 type: string
       *                 description: New name of the resource type
       *               description:
       *                 type: string
       *                 description: New description of the resource type
       *     responses:
       *       200:
       *         description: Resource type updated successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Resource type not found
       */
      case "PATCH":
        await ressources_typesController.replaceRessources_types(req, res);
        break;

       /**
       * @swagger
       * /api/ressources_types:
       *   delete:
       *     description: Delete a resource type by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - ressources_types
       *     parameters:
       *       - name: ressource_type_uuid
       *         in: query
       *         description: UUID of the resource type to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: Resource type deleted successfully
       *       400:
       *         description: Invalid UUID
       *       404:
       *         description: Resource type not found
       */
      case "DELETE":
        await ressources_typesController.deleteRessources_types(req, res);
        break;

      default:
        res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default authenticateToken(handler)