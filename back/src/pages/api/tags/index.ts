import type { NextApiRequest, NextApiResponse } from 'next';
import { TagService } from '@/services/tagService';
import { TagController } from '@/controllers/tagController';
import { initializeDataSource } from '../../../data-source';
import { corsMiddleware } from '@/utils/corsMiddleware';
import { authenticateToken } from '@/utils/verifToken';

const tagService = new TagService();
const tagController = new TagController(tagService);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialise la source de données avant de traiter la requête
    await initializeDataSource();

    // Applique la configuration CORS
    await corsMiddleware(req, res);

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
   
    // Gestion des différentes méthodes HTTP
    switch (req.method) {
       /**
       * @swagger
       * /api/tags:
       *   get:
       *     description: Retrieve all tags or a specific tag by ID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - tags
       *     parameters:
       *       - name: tag_uuid
       *         in: query
       *         description: UUID of the tag to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of tags or a specific tag
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   tag_uuid:
       *                     type: string
       *                     description: The UUID of the tag
       *                   name:
       *                     type: string
       *                     description: The name of the tag
       *       404:
       *         description: Tag not found
       */
      case 'GET':
        if (req.query.tag_uuid) {
          return tagController.getTagById(req, res);
        } else {
          return tagController.getAllTags(req, res);
        }
       /**
       * @swagger
       * /api/tags:
       *   post:
       *     description: Create a new tag
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - tags
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               name:
       *                 type: string
       *                 description: The name of the new tag
       *     responses:
       *       201:
       *         description: Tag created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return tagController.createTag(req, res);
      
       /**
       * @swagger
       * /api/tags:
       *   put:
       *     description: Update an existing tag
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - tags
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               tag_uuid:
       *                 type: string
       *                 description: The UUID of the tag to update
       *               name:
       *                 type: string
       *                 description: The new name for the tag
       *     responses:
       *       200:
       *         description: Tag updated successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Tag not found
       */
      case 'PUT':
        return tagController.updateTag(req, res);
      
       /**
       * @swagger
       * /api/tags:
       *   delete:
       *     description: Delete a tag by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - tags
       *     parameters:
       *       - name: tag_uuid
       *         in: query
       *         description: UUID of the tag to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: Tag deleted successfully
       *       400:
       *         description: Invalid UUID
       *       404:
       *         description: Tag not found
       */
      case 'DELETE':
        return tagController.deleteTag(req, res);

      default:
        // Méthodes non autorisées
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default authenticateToken(handler)