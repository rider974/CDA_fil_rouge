import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../data-source';
import { RoleService } from '@/services/roleService';
import { RoleController } from '@/controllers/roleController';
import Cors from 'nextjs-cors';

const roleService = new RoleService();
const roleController = new RoleController(roleService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await AppDataSource.initialize(); 
  await Cors(req, res, {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: 'http://localhost:3000'
  });

  switch (req.method) {
    case 'GET':
      return roleController.getAllRoles(req, res);
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
}
