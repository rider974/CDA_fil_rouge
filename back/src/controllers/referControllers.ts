import { NextApiRequest, NextApiResponse } from 'next';
import { ReferService } from '@/services/referServices';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Controller responsible for handling requests related to the association between tags and sharing sessions.
 */
export class ReferController {
  private referService: ReferService;

  constructor(referService: ReferService) {
    this.referService = referService;
  }

  /**
   * Create an association between a tag and a sharing session.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async createAssociation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { tag_uuid, sharing_session_uuid } = req.body;
      const association = await this.referService.createAssociation(tag_uuid, sharing_session_uuid);
      return res.status(201).json(association);
    } catch (error) {
      console.error("Error creating association:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete an association between a tag and a sharing session.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async deleteAssociation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { tag_uuid, sharing_session_uuid } = req.query;
      if (typeof tag_uuid !== 'string' || typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag or sharing session UUID" });
      }
      const success = await this.referService.deleteAssociation(tag_uuid, sharing_session_uuid);
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
   * Retrieve all sharing sessions associated with a specific tag.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async getSharingSessionsByTag(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { tag_uuid } = req.query;
      if (typeof tag_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag UUID" });
      }
      const sharingSessions = await this.referService.getSharingSessionsByTag(tag_uuid);
      return res.status(200).json(sharingSessions);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error fetching sharing sessions by tag:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieve all tags associated with a specific sharing session.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async getTagsBySharingSession(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { sharing_session_uuid } = req.query;
      if (typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid sharing session UUID" });
      }
      const tags = await this.referService.getTagsBySharingSession(sharing_session_uuid);
      return res.status(200).json(tags);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error fetching tags by sharing session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
