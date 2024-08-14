import type { NextApiRequest, NextApiResponse } from 'next';
import { RoleService } from '@/services/roleService';
import { RoleController } from '@/controllers/roleController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

const roleService = new RoleService();
const roleController = new RoleController(roleService);

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
   res.setHeader('Content-Security-Policy', "default-src 'self'");
   res.setHeader('X-Content-Type-Options', 'nosniff');
   res.setHeader('X-Frame-Options', 'DENY');
   res.setHeader('X-XSS-Protection', '1; mode=block');
  //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
   res.setHeader('Referrer-Policy', 'no-referrer');
   res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=()');

    switch (req.method) {
      case 'GET':
        // Check if the request is for a single role by ID or all roles
        if (req.query.role_uuid) {
          return roleController.getRoleById(req, res);
        } else {
          return roleController.getAllRoles(req, res);
        }
      case 'POST':
        return roleController.createRole(req, res);
      case 'PUT':
        return roleController.replaceRole(req, res);
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
