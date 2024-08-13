import { AppDataSource } from "@/data-source";
import { Ressource } from "@/entity/ressource";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors";
import { DeepPartial } from "typeorm";
import User from "@/entity/user";
import { RessourceStatus } from "@/entity/ressourceStatus";

interface CreateRessourceDTO {
  title: string;
  content: string;
  summary: string;
  is_reported: boolean;
  user_uuid: string;
  ressource_type_uuid: string;
  ressource_status_uuid: string;
  updatedBy: DeepPartial<User>;
}

export class RessourceService {
  /**
   * Retrieves the ressource status by name.
   * @param name - The name of the ressource status to retrieve.
   * @returns A promise that resolves to the ressource status if found.
   * @throws EntityNotFoundError if the ressource status is not found.
   */
  async getRessourceStatusByName(name: string): Promise<RessourceStatus> {
    try {
      const status = await AppDataSource.manager.findOne(RessourceStatus, { where: { name } });
      if (!status) {
        throw new EntityNotFoundError('RessourceStatus', name);
      }
      return status;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error fetching ressource status by name:", error);
      throw new Error('An error occurred while fetching the ressource status');
    }
  }
  async getAllRessources(): Promise<Ressource[]> {
    return await AppDataSource.manager.find(Ressource);
  }

  /**
   * Retrieves a ressource by its UUID.
   * @param ressource_uuid - The UUID of the ressource to retrieve.
   * @returns A promise that resolves to the ressource if found, or null if not found.
   * @throws EntityNotFoundError if the ressource is not found.
   */
  async getRessourceById(ressource_uuid: string): Promise<Ressource | null> {
    try {
      const ressource = await AppDataSource.manager.findOne(Ressource, { where: { ressource_uuid } });
      if (!ressource) {
        throw new EntityNotFoundError('Ressource', ressource_uuid);
      }
      return ressource;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error fetching ressource by ID:", error);
      throw new Error('An error occurred while fetching the ressource');
    }
  }

  /**
   * Creates a new ressource with transaction.
   * @param ressourceData - The data to create the new ressource.
   * @returns A promise that resolves to the created ressource.
   * @throws UniqueConstraintViolationError if a unique constraint is violated.
   */
  async createRessource(ressourceData: CreateRessourceDTO): Promise<Ressource> {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      try {
        const ressource = transactionalEntityManager.create(Ressource, ressourceData);
        return await transactionalEntityManager.save(ressource);
      } catch (error) {
        if (error instanceof UniqueConstraintViolationError) {
          throw error;
        }
        console.error("Error creating ressource:", error);
        throw new Error('An error occurred while creating the ressource');
      }
    });
  }
  /**
   * Replaces an existing ressource with new data.
   * @param ressource_uuid - The UUID of the ressource to replace.
   * @param ressourceData - The new data for the ressource.
   * @returns A promise that resolves to the updated ressource if found and updated, or null if not found.
   * @throws EntityNotFoundError if the ressource is not found.
   */
  async replaceRessource(ressource_uuid: string, ressourceData: Partial<CreateRessourceDTO>): Promise<Ressource | null> {
    try {
      const existingRessource = await AppDataSource.manager.findOne(Ressource, { where: { ressource_uuid } });
      if (!existingRessource) {
        throw new EntityNotFoundError('Ressource', ressource_uuid);
      }

      const updatedRessource = await AppDataSource.manager.save(Ressource, { ...existingRessource, ...ressourceData });
      return updatedRessource;
    } catch (error) {
      if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error replacing ressource:", error);
      throw new Error('An error occurred while replacing the ressource');
    }
  }

  /**
   * Deletes a ressource by its UUID.
   * @param ressource_uuid - The UUID of the ressource to delete.
   * @returns A promise that resolves to a boolean indicating success or failure of the deletion.
   * @throws Error if the deletion fails.
   */
  async deleteRessource(ressource_uuid: string): Promise<boolean> {
    try {
      const result = await AppDataSource.manager.delete(Ressource, { ressource_uuid });
      return result.affected !== null && result.affected !== undefined && result.affected > 0;
    } catch (error) {
      console.error("Error deleting ressource:", error);
      throw error;
    }
  }
}
