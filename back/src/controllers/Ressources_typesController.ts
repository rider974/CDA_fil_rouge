import { NextApiRequest, NextApiResponse } from 'next';
import { Ressources_typesService } from '@/services/ressources_typesService';
import Joi from 'joi';
import { EntityNotFoundError, UniqueConstraintViolationError } from '../errors/errors';

// Schema for validating role creation and updates
const ressources_typesSchema = Joi.object({
  type_name: Joi.string().required(),
});

export class Ressources_typesController {
  private Ressources_typesService: Ressources_typesService;

  /**
   * Creates an instance of RoleController.
   * @param Ressources_typesService - Service for managing roles.
   */
  constructor(Ressources_typesService: Ressources_typesService) {
    this.Ressources_typesService = Ressources_typesService;
  }

  /**
   * Handles the creation of a new ressources types.
   * Validates request data, creates a new ressources type, and returns it.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The created ressources_type or an error response.
   */
  async createRessources_types(req: NextApiRequest, res: NextApiResponse) {
    
    
  }

  /**
   * Retrieves all resources_types.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of ressources_types or an error response.
   */
  async getAllRessources_types(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Retrieve all ressources_types
        const ressources_types = await this.Ressources_typesService.getAllRessources_types();
        return res.status(200).json(ressources_types);
      } catch (error) {
        // Handle errors
        console.error("Error fetching ressources_types:", error);
        return res.status(500).json({ error: "Error fetching ressources_types" });
      }
  }


  /**
   * Replaces an existing ressources_types with new data.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The updated ressources_types or an error response.
   */
  async replaceRessources_types(req: NextApiRequest, res: NextApiResponse) {
   
  }
}
