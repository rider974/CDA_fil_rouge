import { AppDataSource } from "@/data-source";
import { RessourceStatusHistory } from "@/entity/ressourceStatusHistory";
import { Ressource } from "@/entity/ressource";
import { RessourceStatus } from "@/entity/ressourceStatus";
import { EntityNotFoundError } from "../errors/errors"; 

interface CreateRessourceStatusHistoryDTO {
    status_changed_at: Date;
    preview_state_uuid: string;
    new_state_uuid: string;
    ressource_uuid: string;
}

export class RessourceStatusHistoryService {
    /**
     * Retrieves all status history entries from the database.
     * @returns A list of all status history entries.
     * @throws Error if an error occurs while fetching the entries.
     */
    async getAllStatusHistories(): Promise<RessourceStatusHistory[]> {
        try {
            return await AppDataSource.manager.find(RessourceStatusHistory);
        } catch (error) {
            console.error("Error fetching status histories:", error);
            throw new Error('An error occurred while fetching status histories');
        }
    }

    /**
     * Retrieves a specific status history entry by its UUID.
     * @param ressource_status_history_uuid - The UUID of the status history entry to retrieve.
     * @returns The status history entry corresponding to the UUID or null if not found.
     * @throws Error if an error occurs while fetching the entry.
     */
    async getStatusHistoryById(ressource_status_history_uuid: string): Promise<RessourceStatusHistory | null> {
        try {
            return await AppDataSource.manager.findOne(RessourceStatusHistory, {
                where: { ressource_status_history_uuid }
            });
        } catch (error) {
            console.error("Error fetching status history by UUID:", error);
            throw new Error('An error occurred while fetching the status history entry');
        }
    }

    /**
     * Creates a new status history entry in the database.
     * @param historyData - The data for the new status history entry to create.
     * @returns The newly created status history entry.
     * @throws EntityNotFoundError if the ressource or ressource status is not found.
     * @throws Error if an error occurs while creating the entry.
     */
    async createStatusHistory(historyData: CreateRessourceStatusHistoryDTO): Promise<RessourceStatusHistory> {
        try {
            const ressource = await AppDataSource.manager.findOne(Ressource, {
                where: { ressource_uuid: historyData.ressource_uuid }
            });

            if (!ressource) {
                throw new EntityNotFoundError('Ressource', historyData.ressource_uuid);
            }

            const previewState = await AppDataSource.manager.findOne(RessourceStatus, {
                where: { ressource_status_uuid: historyData.preview_state_uuid }
            });

            if (!previewState) {
                throw new EntityNotFoundError('RessourceStatus', historyData.preview_state_uuid);
            }

            const newState = await AppDataSource.manager.findOne(RessourceStatus, {
                where: { ressource_status_uuid: historyData.new_state_uuid }
            });

            if (!newState) {
                throw new EntityNotFoundError('RessourceStatus', historyData.new_state_uuid);
            }

            const historyEntry = AppDataSource.manager.create(RessourceStatusHistory, {
                ...historyData,
                ressource,
                preview_state: previewState,
                new_state: newState,
            });

            return await AppDataSource.manager.save(historyEntry);
        } catch (error) {
            console.error("Error creating status history:", error);
            throw new Error('An error occurred while creating the status history');
        }
    }

    /**
     * Replaces an existing status history entry with new data.
     * @param ressource_status_history_uuid - The UUID of the status history entry to replace.
     * @param historyData - The new data for the status history entry.
     * @returns The updated status history entry or null if not found.
     * @throws EntityNotFoundError if the status history entry is not found.
     * @throws Error if an error occurs while replacing the entry.
     */
    async replaceStatusHistory(ressource_status_history_uuid: string, historyData: CreateRessourceStatusHistoryDTO): Promise<RessourceStatusHistory | null> {
        try {
            const existingHistory = await this.getStatusHistoryById(ressource_status_history_uuid);
            if (!existingHistory) {
                throw new EntityNotFoundError('RessourceStatusHistory', ressource_status_history_uuid);
            }

            const ressource = await AppDataSource.manager.findOne(Ressource, {
                where: { ressource_uuid: historyData.ressource_uuid }
            });

            if (!ressource) {
                throw new EntityNotFoundError('Ressource', historyData.ressource_uuid);
            }

            const previewState = await AppDataSource.manager.findOne(RessourceStatus, {
                where: { ressource_status_uuid: historyData.preview_state_uuid }
            });

            if (!previewState) {
                throw new EntityNotFoundError('RessourceStatus', historyData.preview_state_uuid);
            }

            const newState = await AppDataSource.manager.findOne(RessourceStatus, {
                where: { ressource_status_uuid: historyData.new_state_uuid }
            });

            if (!newState) {
                throw new EntityNotFoundError('RessourceStatus', historyData.new_state_uuid);
            }

            const updatedHistory = await AppDataSource.manager.save(RessourceStatusHistory, {
                ...existingHistory,
                ...historyData,
                ressource,
                preview_state: previewState,
                new_state: newState,
            });

            return updatedHistory;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error replacing status history:", error);
            throw new Error('An error occurred while replacing the status history');
        }
    }

    /**
     * Updates specific fields of an existing status history entry.
     * @param ressource_status_history_uuid - The UUID of the status history entry to update.
     * @param historyData - The partial data for the status history entry.
     * @returns The updated status history entry or null if not found.
     * @throws EntityNotFoundError if the status history entry is not found.
     * @throws Error if an error occurs while updating the entry.
     */
    async updateStatusHistoryFields(ressource_status_history_uuid: string, historyData: Partial<CreateRessourceStatusHistoryDTO>): Promise<RessourceStatusHistory | null> {
        try {
            const existingHistory = await this.getStatusHistoryById(ressource_status_history_uuid);
            if (!existingHistory) {
                throw new EntityNotFoundError('RessourceStatusHistory', ressource_status_history_uuid);
            }

            if (historyData.ressource_uuid) {
                const ressource = await AppDataSource.manager.findOne(Ressource, {
                    where: { ressource_uuid: historyData.ressource_uuid }
                });

                if (!ressource) {
                    throw new EntityNotFoundError('Ressource', historyData.ressource_uuid);
                }
            }

            if (historyData.preview_state_uuid) {
                const previewState = await AppDataSource.manager.findOne(RessourceStatus, {
                    where: { ressource_status_uuid: historyData.preview_state_uuid }
                });

                if (!previewState) {
                    throw new EntityNotFoundError('RessourceStatus', historyData.preview_state_uuid);
                }
            }

            if (historyData.new_state_uuid) {
                const newState = await AppDataSource.manager.findOne(RessourceStatus, {
                    where: { ressource_status_uuid: historyData.new_state_uuid }
                });

                if (!newState) {
                    throw new EntityNotFoundError('RessourceStatus', historyData.new_state_uuid);
                }
            }

            await AppDataSource.manager.update(RessourceStatusHistory, { ressource_status_history_uuid }, historyData);
            return await this.getStatusHistoryById(ressource_status_history_uuid);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error updating status history fields:", error);
            throw new Error('An error occurred while updating the status history fields');
        }
    }
    
    /**
     * Deletes a status history entry from the database by its UUID.
     * @param ressource_status_history_uuid - The UUID of the status history entry to delete.
     * @returns A boolean indicating if the deletion was successful.
     * @throws Error if an error occurs while deleting the entry.
     */
    async deleteStatusHistory(ressource_status_history_uuid: string): Promise<boolean> {
        try {
            const result = await AppDataSource.manager.delete(RessourceStatusHistory, ressource_status_history_uuid);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting status history:", error);
            throw error;
        }
    }
}
