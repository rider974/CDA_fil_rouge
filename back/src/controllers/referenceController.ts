import { NextApiRequest, NextApiResponse } from 'next';
import { ReferenceService } from '@/services/referenceServices';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Controller responsible for handling requests related to the association between resources and sharing sessions.
 */
export class ReferenceController {
  private referenceService: ReferenceService;

  constructor(referenceService: ReferenceService) {
    this.referenceService = referenceService;
  }

  /**
   * Create an association between a resource and a sharing session.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async createAssociation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_uuid, sharing_session_uuid } = req.body;
      const association = await this.referenceService.createAssociation(ressource_uuid, sharing_session_uuid);
      return res.status(201).json(association);
    } catch (error) {
      console.error("Error creating association:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete an association between a resource and a sharing session.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async deleteAssociation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_uuid, sharing_session_uuid } = req.query;
      if (typeof ressource_uuid !== 'string' || typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid resource or sharing session UUID" });
      }
      const success = await this.referenceService.deleteAssociation(ressource_uuid, sharing_session_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Association not found" });
      }
    } catch (error) {
      console.error("Error deleting association:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieve all sharing sessions associated with a specific resource.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async getSharingSessionsByRessource(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_uuid } = req.query;
      if (typeof ressource_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid resource UUID" });
      }
      const sharingSessions = await this.referenceService.getSharingSessionsByRessource(ressource_uuid);
      return res.status(200).json(sharingSessions);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error fetching sharing sessions by resource:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieve all resources associated with a specific sharing session.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async getRessourcesBySharingSession(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { sharing_session_uuid } = req.query;
      if (typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid sharing session UUID" });
      }
      const ressources = await this.referenceService.getRessourcesBySharingSession(sharing_session_uuid);
      return res.status(200).json(ressources);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error fetching resources by sharing session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
