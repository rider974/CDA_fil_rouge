import { NextApiRequest, NextApiResponse } from 'next';
import { SharingSessionService } from '@/services/sharing_sessionService';
import Joi from 'joi';
import { EntityNotFoundError, UniqueConstraintViolationError } from '../errors/errors';

// Schema for validating sharing session creation and updates
const sharingSessionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  event_start_datetime: Joi.date().required(),
  event_end_datetime: Joi.date().required(),
  user_uuid: Joi.string().uuid().required(),
  ressource_uuids: Joi.array().items(Joi.string().uuid()).optional(),
  tag_uuids: Joi.array().items(Joi.string().uuid()).optional(),
});

export class SharingSessionController {
  private sharingSessionService: SharingSessionService;

  /**
   * Creates an instance of SharingSessionController.
   * @param sharingSessionService - Service for managing sharing sessions.
   */
  constructor(sharingSessionService: SharingSessionService) {
    this.sharingSessionService = sharingSessionService;
  }

  /**
   * Handles the creation of a new sharing session.
   * Validates request data, creates a new sharing session, and returns it.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The created sharing session or an error response.
   */
  async createSharingSession(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate request data
      const { error } = sharingSessionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Create new sharing session
      const newSharingSession = await this.sharingSessionService.createSharingSession(req.body);
      return res.status(201).json(newSharingSession);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationError) {
        return res.status(409).json({ error: error.message });
      }

      // Handle non-specific errors
      console.error("Error creating sharing session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieves all sharing sessions.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of sharing sessions or an error response.
   */
  async getAllSharingSessions(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Retrieve all sharing sessions
      const sharingSessions = await this.sharingSessionService.getAllSharingSessions();
      return res.status(200).json(sharingSessions);
    } catch (error) {
      // Handle errors
      console.error("Error fetching sharing sessions:", error);
      return res.status(500).json({ error: "Error fetching sharing sessions" });
    }
  }

  /**
   * Retrieves a sharing session by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The sharing session if found or an error response.
   */
  async getSharingSessionById(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Validate the UUID
      const { sharing_session_uuid } = req.query;
      if (typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid sharing session UUID" });
      }

      // Retrieve the sharing session
      const sharingSession = await this.sharingSessionService.getSharingSessionById(sharing_session_uuid);
      if (sharingSession) {
        return res.status(200).json(sharingSession);
      } else {
        return res.status(404).json({ error: "Sharing session not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error retrieving sharing session by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Replaces an existing sharing session with new data.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The updated sharing session or an error response.
   */
  async replaceSharingSession(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { sharing_session_uuid } = req.query;
      if (typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid sharing session UUID" });
      }

      // Validate request data
      const { error } = sharingSessionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Replace the sharing session
      const updatedSharingSession = await this.sharingSessionService.replaceSharingSession(sharing_session_uuid, req.body);
      if (updatedSharingSession) {
        return res.status(200).json(updatedSharingSession);
      } else {
        return res.status(404).json({ error: "Sharing session not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error replacing sharing session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Deletes a sharing session by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A 204 status if deletion is successful or an error response.
   */
  async deleteSharingSession(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { sharing_session_uuid } = req.query;
      if (typeof sharing_session_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid sharing session UUID" });
      }

      // Delete the sharing session
      const success = await this.sharingSessionService.deleteSharingSession(sharing_session_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Sharing session not found" });
      }
    } catch (error) {
      console.error("Error deleting sharing session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
