import { NextApiRequest, NextApiResponse } from 'next';
import { HaveService } from '@/services/haveServices';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Controller responsible for handling requests related to the association between tags and resources.
 */
export class HaveController {
  private haveService: HaveService;

  constructor(haveService: HaveService) {
    this.haveService = haveService;
  }

  /**
   * Create an association between a tag and a resource.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async createAssociation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { tag_uuid, ressource_uuid } = req.body;
      const association = await this.haveService.createAssociation(tag_uuid, ressource_uuid);
      return res.status(201).json(association);
    } catch (error) {
      console.error("Error creating association:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete an association between a tag and a resource.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async deleteAssociation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { tag_uuid, ressource_uuid } = req.query;
      if (typeof tag_uuid !== 'string' || typeof ressource_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag or resource UUID" });
      }
      const success = await this.haveService.deleteAssociation(tag_uuid, ressource_uuid);
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
   * Retrieve all resources associated with a specific tag.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async getResourcesByTag(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { tag_uuid } = req.query;
      if (typeof tag_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag UUID" });
      }
      const resources = await this.haveService.getResourcesByTag(tag_uuid);
      return res.status(200).json(resources);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error fetching resources by tag:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieve all tags associated with a specific resource.
   * @param req - The API request object.
   * @param res - The API response object.
   */
  async getTagsByResource(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_uuid } = req.query;
      if (typeof ressource_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid resource UUID" });
      }
      const tags = await this.haveService.getTagsByResource(ressource_uuid);
      return res.status(200).json(tags);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error fetching tags by resource:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
