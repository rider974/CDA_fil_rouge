import { AppDataSource } from "@/data-source";
import { SharingSession } from "@/entity/sharingSession";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors";
import User from "@/entity/user";

interface CreateSharingSessionDTO {
    title: string;
    description?: string;
    event_start_datetime: Date;
    event_end_datetime: Date;
    user_uuid: string;
    ressourceUuids?: string[];
    tagUuids?: string[];
}

export class SharingSessionService {
    /**
     * Retrieves all sharing sessions from the database.
     * @returns A promise that resolves to an array of sharing sessions.
     */
    async getAllSharingSessions(): Promise<SharingSession[]> {
        return await AppDataSource.manager.find(SharingSession, { relations: ['user', 'ressources', 'tags'] });
    }

    /**
     * Retrieves a sharing session by its UUID.
     * @param sharing_session_uuid - UUID of the sharing session to be retrieved.
     * @returns A promise that resolves to the sharing session if found, null otherwise.
     * @throws EntityNotFoundError - If the sharing session with the given UUID does not exist.
     */
    async getSharingSessionById(sharing_session_uuid: string): Promise<SharingSession | null> {
        try {
            const sharingSession = await AppDataSource.manager.findOne(SharingSession, {
                where: { sharing_session_uuid },
                relations: ['user', 'ressources', 'tags'],
            });
            if (!sharingSession) {
                throw new EntityNotFoundError('SharingSession', sharing_session_uuid);
            }
            return sharingSession;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error fetching sharing session by ID:", error);
            throw new Error('An error occurred while fetching the sharing session');
        }
    }

    /**
     * Creates a new sharing session in the database.
     * @param sharingSessionData - Data for the new sharing session.
     * @returns A promise that resolves to the created sharing session.
     * @throws UniqueConstraintViolationError - If a sharing session with the same title already exists.
     */
    async createSharingSession(sharingSessionData: CreateSharingSessionDTO): Promise<SharingSession> {
        try {
            const existingSession = await AppDataSource.manager.findOne(SharingSession, {
                where: { title: sharingSessionData.title },
            });
            if (existingSession) {
                throw new UniqueConstraintViolationError('Sharing session title already exists');
            }
    
            // Récupérer l'utilisateur en utilisant user_uuid
            const user = await AppDataSource.manager.findOne(User, {
                where: { user_uuid: sharingSessionData.user_uuid },
            });
            if (!user) {
                throw new EntityNotFoundError('User', sharingSessionData.user_uuid);
            }
    
            const sharingSession = AppDataSource.manager.create(SharingSession, {
                ...sharingSessionData,
                user: user 
            });
    
            return await AppDataSource.manager.save(sharingSession);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError) {
                throw error;
            }
            console.error("Error creating sharing session:", error);
            throw new Error('An error occurred while creating the sharing session');
        }
    }
    

    /**
     * Replaces an existing sharing session with new data.
     * @param sharing_session_uuid - UUID of the sharing session to be replaced.
     * @param sharingSessionData - New data for the sharing session.
     * @returns A promise that resolves to the updated sharing session or null if not found.
     * @throws EntityNotFoundError - If the sharing session with the given UUID does not exist.
     */
    async replaceSharingSession(
        sharing_session_uuid: string,
        sharingSessionData: Partial<CreateSharingSessionDTO>
    ): Promise<SharingSession | null> {
        try {
            const existingSession = await AppDataSource.manager.findOne(SharingSession, {
                where: { sharing_session_uuid },
            });
            if (!existingSession) {
                throw new EntityNotFoundError('SharingSession', sharing_session_uuid);
            }

            const updatedSession = await AppDataSource.manager.save(
                SharingSession,
                { ...existingSession, ...sharingSessionData }
            );
            return updatedSession;
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error replacing sharing session:", error);
            throw new Error('An error occurred while replacing the sharing session');
        }
    }

    /**
     * Deletes a sharing session by its UUID.
     * @param sharing_session_uuid - UUID of the sharing session to be deleted.
     * @returns A promise that resolves to true if the deletion was successful, false otherwise.
     */
    async deleteSharingSession(sharing_session_uuid: string): Promise<boolean> {
        try {
            const result = await AppDataSource.manager.delete(SharingSession, { sharing_session_uuid });
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting sharing session:", error);
            throw error;
        }
    }
}
