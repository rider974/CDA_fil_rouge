import { NextApiRequest, NextApiResponse } from 'next';
import { RessourceStatusHistoryService } from '@/services/ressources_status_historyService';
import { EntityNotFoundError } from '../errors/errors';
import Joi from 'joi';

// Schema for validating RessourceStatusHistory creation and updates
const statusHistorySchema = Joi.object({
  status_changed_at: Joi.date().iso().required(),
  preview_state_uuid: Joi.string().uuid().required(),
  new_state_uuid: Joi.string().uuid().required(),
  ressource_uuid: Joi.string().uuid().required(),
});

export class RessourceStatusHistoryController {
  private statusHistoryService: RessourceStatusHistoryService;

  /**
   * Creates an instance of RessourceStatusHistoryController.
   * @param statusHistoryService - Service for managing status history entries.
   */
  constructor(statusHistoryService: RessourceStatusHistoryService) {
    this.statusHistoryService = statusHistoryService;
  }

  /**
   * Handles the creation of a new status history entry.
   * Validates request data, creates a new status history entry, and returns it.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The created status history entry or an error response.
   */
  async createStatusHistory(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate request data
      const { error } = statusHistorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Create new status history entry
      const newStatusHistory = await this.statusHistoryService.createStatusHistory(req.body);
      return res.status(201).json(newStatusHistory);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      // Handle non-specific errors
      console.error("Error creating status history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieves all status history entries.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of status history entries or an error response.
   */
  async getAllStatusHistories(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Retrieve all status history entries
      const statusHistories = await this.statusHistoryService.getAllStatusHistories();
      return res.status(200).json(statusHistories);
    } catch (error) {
      // Handle errors
      console.error("Error fetching status histories:", error);
      return res.status(500).json({ error: "Error fetching status histories" });
    }
  }

  /**
   * Retrieves a status history entry by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The status history entry if found or an error response.
   */
  async getStatusHistoryById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_status_history_uuid } = req.query;
      if (typeof ressource_status_history_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid status history UUID" });
      }

      // Retrieve the status history entry
      const statusHistory = await this.statusHistoryService.getStatusHistoryById(ressource_status_history_uuid);
      if (statusHistory) {
        return res.status(200).json(statusHistory);
      } else {
        return res.status(404).json({ error: "Status history not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error retrieving status history by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Replaces an existing status history entry with new data.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The updated status history entry or an error response.
   */
  async replaceStatusHistory(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_status_history_uuid } = req.query;
      if (typeof ressource_status_history_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid status history UUID" });
      }

      // Validate request data
      const { error } = statusHistorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Replace the status history entry
      const updatedStatusHistory = await this.statusHistoryService.replaceStatusHistory(ressource_status_history_uuid, req.body);
      if (updatedStatusHistory) {
        return res.status(200).json(updatedStatusHistory);
      } else {
        return res.status(404).json({ error: "Status history not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error replacing status history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Updates specific fields of an existing status history entry.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The updated status history entry or an error response.
   */
  async updateStatusHistoryFields(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_status_history_uuid } = req.query;
      if (typeof ressource_status_history_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid status history UUID" });
      }

      // Validate request data
      const { error } = statusHistorySchema.validate(req.body, { allowUnknown: true });
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Update the status history entry
      const updatedStatusHistory = await this.statusHistoryService.updateStatusHistoryFields(ressource_status_history_uuid, req.body);
      if (updatedStatusHistory) {
        return res.status(200).json(updatedStatusHistory);
      } else {
        return res.status(404).json({ error: "Status history not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error updating status history fields:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  /**
   * Deletes a status history entry by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A 204 status if deletion is successful or an error response.
   */
  async deleteStatusHistory(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { ressource_status_history_uuid } = req.query;
      if (typeof ressource_status_history_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid status history UUID" });
      }

      // Delete the status history entry
      const success = await this.statusHistoryService.deleteStatusHistory(ressource_status_history_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Status history not found" });
      }
    } catch (error) {
      console.error("Error deleting status history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
