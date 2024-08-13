import { AppDataSource } from "@/data-source";
import { RessourceStatus } from "@/entity/ressourceStatus";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors";

interface CreateRessourceStatusDTO {
    name: string;
}

export class RessourceStatusService {
    /**
     * Retrieves all ressource statuses from the database.
     * @returns A promise that resolves to an array of ressource statuses.
     */
    async getAllRessourceStatuses(): Promise<RessourceStatus[]> {
        return await AppDataSource.manager.find(RessourceStatus);
    }

    /**
     * Retrieves a ressource status by its UUID.
     * @param ressource_status_uuid - UUID of the ressource status to be retrieved.
     * @returns A promise that resolves to the ressource status if found, null otherwise.
     * @throws EntityNotFoundError - If the ressource status with the given UUID does not exist.
     */
    async getRessourceStatusById(ressource_status_uuid: string): Promise<RessourceStatus | null> {
        try {
            // Find the ressource status by its UUID
            const ressourceStatus = await AppDataSource.manager.findOne(RessourceStatus, { where: { ressource_status_uuid } });
            if (!ressourceStatus) {
                throw new EntityNotFoundError('RessourceStatus', ressource_status_uuid);
            }
            return ressourceStatus;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error fetching ressource status by ID:", error);
            throw new Error('An error occurred while fetching the ressource status');
        }
    }

    /**
     * Creates a new ressource status in the database.
     * Checks if the ressource status name already exists and throws an error if it does.
     * @param ressourceStatusData - Data for the new ressource status.
     * @returns A promise that resolves to the created ressource status.
     * @throws UniqueConstraintViolationError - If a ressource status with the same name already exists.
     */
    async createRessourceStatus(ressourceStatusData: CreateRessourceStatusDTO): Promise<RessourceStatus> {
        try {
            // Check if a ressource status with the same name already exists
            const existingRessourceStatus = await AppDataSource.manager.findOne(RessourceStatus, { where: { name: ressourceStatusData.name } });
            if (existingRessourceStatus) {
                throw new UniqueConstraintViolationError('Ressource status name already exists');
            }

            // Create and save the new ressource status
            const ressourceStatus = AppDataSource.manager.create(RessourceStatus, ressourceStatusData);
            return await AppDataSource.manager.save(ressourceStatus);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError) {
                throw error;
            }
            console.error("Error creating ressource status:", error);
            throw new Error('An error occurred while creating the ressource status');
        }
    }

    /**
     * Replaces an existing ressource status with new data.
     * @param ressource_status_uuid - UUID of the ressource status to be replaced.
     * @param ressourceStatusData - New data for the ressource status.
     * @returns A promise that resolves to the updated ressource status or null if not found.
     * @throws EntityNotFoundError - If the ressource status with the given UUID does not exist.
     */
    async replaceRessourceStatus(ressource_status_uuid: string, ressourceStatusData: Partial<CreateRessourceStatusDTO>): Promise<RessourceStatus | null> {
        try {
            // Find the ressource status to be replaced
            const existingRessourceStatus = await AppDataSource.manager.findOne(RessourceStatus, { where: { ressource_status_uuid } });
            if (!existingRessourceStatus) {
                throw new EntityNotFoundError('RessourceStatus', ressource_status_uuid);
            }

            // Update and save the ressource status
            const updatedRessourceStatus = await AppDataSource.manager.save(RessourceStatus, { ...existingRessourceStatus, ...ressourceStatusData });
            return updatedRessourceStatus;
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error replacing ressource status:", error);
            throw new Error('An error occurred while replacing the ressource status');
        }
    }

    /**
     * Deletes a ressource status by its UUID.
     * @param ressource_status_uuid - UUID of the ressource status to be deleted.
     * @returns A promise that resolves to true if the deletion was successful, false otherwise.
     */
    async deleteRessourceStatus(ressource_status_uuid: string): Promise<boolean> {
        try {
            // Delete the ressource status and return whether the operation was successful
            const result = await AppDataSource.manager.delete(RessourceStatus, { ressource_status_uuid });
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting ressource status:", error);
            throw error;
        }
    }
}
