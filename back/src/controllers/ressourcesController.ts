import { NextApiRequest, NextApiResponse } from 'next';
import { RessourceService } from '@/services/ressourceService';
import Joi from 'joi';
import { EntityNotFoundError, UniqueConstraintViolationError } from '../errors/errors';

// Schema for validating ressource creation and updates
const ressourceSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().optional(),
  summary: Joi.string().optional(),
  is_reported: Joi.boolean().optional(),
  user_uuid: Joi.string().required(),
  ressource_type_uuid: Joi.string().required(),
  ressource_status_uuid: Joi.string().required(),
  updatedBy: Joi.string().optional(),
});

// Schema for validating ressource patch
const updateStatusSchema = Joi.object({
  ressource_uuid: Joi.string().required(),
  newStatusUuid: Joi.string().required()
});

export class RessourceController {
  private ressourceService: RessourceService;

  /**
   * Creates an instance of RessourceController.
   * @param ressourceService - Service for managing ressources.
   */
  constructor(ressourceService: RessourceService) {
    this.ressourceService = ressourceService;
  }

  /**
   * Handles the creation of a new ressource.
   * Validates request data, creates a new ressource, and returns it.
   * @param req - The API request object containing the ressource data.
   * @param res - The API response object used to send the response.
   * @returns The created ressource or an error response.
   */
  async createRessource(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate request data
      const { error } = ressourceSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      // Create new ressource
      const newRessource = await this.ressourceService.createRessource(req.body);
      return res.status(201).json(newRessource);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationError) {
        return res.status(409).json({ error: error.message });
      }

      // Handle non-specific errors
      console.error("Error creating ressource:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieves all ressources.
   * @param req - The API request object.
   * @param res - The API response object used to send the response.
   * @returns A list of all ressources or an error response.
   */
  async getAllRessources(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Retrieve all ressources
      const ressources = await this.ressourceService.getAllRessources();
      return res.status(200).json(ressources);
    } catch (error) {
      // Handle errors
      console.error("Error fetching ressources:", error);
      return res.status(500).json({ error: "Error fetching ressources" });
    }
  }

  /**
   * Retrieves a ressource by its UUID.
   * @param req - The API request object containing the ressource UUID.
   * @param res - The API response object used to send the response.
   * @returns The ressource if found or an error response.
   */
  async getRessourceById(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate the UUID
      const { ressource_uuid } = req.query;
      if (typeof ressource_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid ressource UUID" });
      }

      // Retrieve the ressource
      const ressource = await this.ressourceService.getRessourceById(ressource_uuid);
      if (ressource) {
        return res.status(200).json(ressource);
      } else {
        return res.status(404).json({ error: "Ressource not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error retrieving ressource by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Replaces an existing ressource with new data.
   * @param req - The API request object containing the ressource UUID and new data.
   * @param res - The API response object used to send the response.
   * @returns The updated ressource or an error response.
   */
  async replaceRessource(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_uuid } = req.query;
      if (typeof ressource_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid ressource UUID" });
      }

      // Validate request data
      const { error } = ressourceSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Replace the ressource
      const updatedRessource = await this.ressourceService.replaceRessource(ressource_uuid, req.body);
      if (updatedRessource) {
        return res.status(200).json(updatedRessource);
      } else {
        return res.status(404).json({ error: "Ressource not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error replacing ressource:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

 /**
   * Updates the status of an existing ressource.
   * @param req - The API request object containing the ressource UUID and new status UUID.
   * @param res - The API response object used to send the response.
   * @returns The updated ressource or an error response.
   */
 async updateRessourceStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { ressource_uuid, newStatusUuid } = req.body;

    // Update the ressource status
    const updatedRessource = await this.ressourceService.updateRessourceStatus(ressource_uuid, newStatusUuid);
    return res.status(200).json(updatedRessource);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error updating ressource status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

  /**
   * Deletes a ressource by its UUID.
   * @param req - The API request object containing the ressource UUID.
   * @param res - The API response object used to send the response.
   * @returns A 204 status if deletion is successful or an error response.
   */
  async deleteRessource(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_uuid } = req.query;
      if (typeof ressource_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid ressource UUID" });
      }

      // Delete the ressource
      const success = await this.ressourceService.deleteRessource(ressource_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Ressource not found" });
      }
    } catch (error) {
      console.error("Error deleting ressource:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
