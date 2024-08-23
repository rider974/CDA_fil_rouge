import type { NextApiRequest, NextApiResponse } from 'next';
import { RoleService } from '@/services/roleService';
import { RoleController } from '@/controllers/roleController';
import { initializeDataSource } from '../../../data-source';
import { corsMiddleware } from '@/utils/corsMiddleware';

const roleService = new RoleService();
const roleController = new RoleController(roleService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();
    await corsMiddleware (req, res);

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    switch (req.method) {
       /**
       * @swagger
       * /api/roles:
       *   get:
       *     description: Retrieve all roles or a specific role by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - roles
       *     parameters:
       *       - name: role_uuid
       *         in: query
       *         description: UUID of the role to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of roles or a specific role
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   role_uuid:
       *                     type: string
       *                     description: UUID of the role
       *                   name:
       *                     type: string
       *                     description: Name of the role
       *                   description:
       *                     type: string
       *                     description: Description of the role
       *       404:
       *         description: Role not found
       */
      case 'GET':
        if (req.query.role_uuid) {
          return roleController.getRoleById(req, res);
        } else {
          return roleController.getAllRoles(req, res);
        }
       /**
       * @swagger
       * /api/roles:
       *   post:
       *     description: Create a new role
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - roles
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               name:
       *                 type: string
       *                 description: The name of the role
       *               description:
       *                 type: string
       *                 description: Description of the role
       *     responses:
       *       201:
       *         description: Role created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return roleController.createRole(req, res);
       /**
       * @swagger
       * /api/roles:
       *   put:
       *     description: Replace an existing role
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - roles
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               role_uuid:
       *                 type: string
       *                 description: UUID of the role to replace
       *               name:
       *                 type: string
       *                 description: New name of the role
       *               description:
       *                 type: string
       *                 description: New description of the role
       *     responses:
       *       200:
       *         description: Role replaced successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: Role not found
       */
      case 'PUT':
        return roleController.replaceRole(req, res);
       /**
       * @swagger
       * /api/roles:
       *   delete:
       *     description: Delete a role by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - roles
       *     parameters:
       *       - name: role_uuid
       *         in: query
       *         description: UUID of the role to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: Role deleted successfully
       *       400:
       *         description: Invalid UUID
       *       404:
       *         description: Role not found
       */
      case 'DELETE':
        return roleController.deleteRole(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
