import { NextApiRequest, NextApiResponse } from 'next';
import { RessourceStatusService } from '@/services/ressources_statusService';
import Joi from 'joi';
import { EntityNotFoundError, UniqueConstraintViolationError } from '../errors/errors';

// Schema for validating ressource status creation and updates
const ressourceStatusSchema = Joi.object({
  name: Joi.string().required(),
});

export class RessourceStatusController {
  private ressourceStatusService: RessourceStatusService;

  /**
   * Creates an instance of RessourceStatusController.
   * @param ressourceStatusService - Service for managing ressource statuses.
   */
  constructor(ressourceStatusService: RessourceStatusService) {
    this.ressourceStatusService = ressourceStatusService;
  }

  /**
   * Handles the creation of a new ressource status.
   * Validates request data, creates a new ressource status, and returns it.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The created ressource status or an error response.
   */
  async createRessourceStatus(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate request data
      const { error } = ressourceStatusSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Create new ressource status
      const newRessourceStatus = await this.ressourceStatusService.createRessourceStatus(req.body);
      return res.status(201).json(newRessourceStatus);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationError) {
        return res.status(409).json({ error: error.message });
      }

      // Handle non-specific errors
      console.error("Error creating ressource status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieves all ressource statuses.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of ressource statuses or an error response.
   */
  async getAllRessourceStatuses(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Retrieve all ressource statuses
      const ressourceStatuses = await this.ressourceStatusService.getAllRessourceStatuses();
      return res.status(200).json(ressourceStatuses);
    } catch (error) {
      // Handle errors
      console.error("Error fetching ressource statuses:", error);
      return res.status(500).json({ error: "Error fetching ressource statuses" });
    }
  }

  /**
   * Retrieves a ressource status by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The ressource status if found or an error response.
   */
  async getRessourceStatusById(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate the UUID
      const { ressource_status_uuid } = req.query;
      if (typeof ressource_status_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid ressource status UUID" });
      }

      // Retrieve the ressource status
      const ressourceStatus = await this.ressourceStatusService.getRessourceStatusById(ressource_status_uuid);
      if (ressourceStatus) {
        return res.status(200).json(ressourceStatus);
      } else {
        return res.status(404).json({ error: "Ressource status not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error retrieving ressource status by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Replaces an existing ressource status with new data.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The updated ressource status or an error response.
   */
  async replaceRessourceStatus(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_status_uuid } = req.query;
      if (typeof ressource_status_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid ressource status UUID" });
      }

      // Validate request data
      const { error } = ressourceStatusSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Replace the ressource status
      const updatedRessourceStatus = await this.ressourceStatusService.replaceRessourceStatus(ressource_status_uuid, req.body);
      if (updatedRessourceStatus) {
        return res.status(200).json(updatedRessourceStatus);
      } else {
        return res.status(404).json({ error: "Ressource status not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error replacing ressource status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Deletes a ressource status by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A 204 status if deletion is successful or an error response.
   */
  async deleteRessourceStatus(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_status_uuid } = req.query;
      if (typeof ressource_status_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid ressource status UUID" });
      }

      // Delete the ressource status
      const success = await this.ressourceStatusService.deleteRessourceStatus(ressource_status_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Ressource status not found" });
      }
    } catch (error) {
      console.error("Error deleting ressource status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
