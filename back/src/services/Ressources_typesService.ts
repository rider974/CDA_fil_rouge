import { AppDataSource } from "@/data-source";
import { RessourceType  } from "@/entity/ressourceType";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors";

interface CreateRessources_typesDTO {
    type_name: string;
}

export class Ressources_typesService {
    /**
     * Retrieves all ressources_types from the database.
     * @returns A promise that resolves to an array of RessourceType.
     */
    async getAllRessources_types(): Promise<RessourceType[]> {
        return await AppDataSource.manager.find(RessourceType);
    }

    
}
