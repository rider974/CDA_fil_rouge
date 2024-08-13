import type { NextApiRequest, NextApiResponse } from 'next';
import { RessourceStatusService } from '@/services/ressources_statusService';
import { RessourceStatusController } from '@/controllers/ressources_statusController';
import { initializeDataSource } from '@/data-source';
import Cors from 'nextjs-cors';

// Initialize the service and controller for RessourceStatus
const ressourceStatusService = new RessourceStatusService();
const ressourceStatusController = new RessourceStatusController(ressourceStatusService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initializeDataSource();
  await Cors(req, res, {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: 'http://localhost:3000',
  });

  switch (req.method) {
    case 'GET':
        // Check if the request is for a single ressource status by ID or all ressource statuses
        if (req.query.ressource_status_uuid) {
            return ressourceStatusController.getRessourceStatusById(req, res);
        } else {
            return ressourceStatusController.getAllRessourceStatuses(req, res);
        }
    case 'POST':
      return ressourceStatusController.createRessourceStatus(req, res);
    case 'PUT':
      return ressourceStatusController.replaceRessourceStatus(req, res);
    case 'DELETE':
      return ressourceStatusController.deleteRessourceStatus(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
