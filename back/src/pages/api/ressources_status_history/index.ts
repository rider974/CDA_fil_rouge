import type { NextApiRequest, NextApiResponse } from 'next';
import { RessourceStatusHistoryService } from '@/services/ressources_status_historyService';
import {RessourceStatusHistoryController } from '@/controllers/ressources_status_historyController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

// Initialize the service and controller
const statusHistoryService = new RessourceStatusHistoryService();
const statusHistoryController = new RessourceStatusHistoryController(statusHistoryService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the database connection
    await initializeDataSource();

    // Set up CORS
    await Cors(req, res, {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000', // Adjust this to your front-end URL or use `*` for all origins
    });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
   

    // Handle the request based on the method
    switch (req.method) {
      case 'GET':
        // Check if the request is for a single status history entry by ID or all entries
        if (req.query.ressource_status_history_uuid) {
          return statusHistoryController.getStatusHistoryById(req, res);
        } else {
          return statusHistoryController.getAllStatusHistories(req, res);
        }
      case 'POST':
        return statusHistoryController.createStatusHistory(req, res);
      case 'PUT':
        return statusHistoryController.replaceStatusHistory(req, res);
      case 'PATCH':
        return statusHistoryController.updateStatusHistoryFields(req, res);
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
