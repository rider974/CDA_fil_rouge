import { AppDataSource } from '@/data-source';
import { Reference } from '@/entity/reference';
import { Ressource } from '@/entity/ressource';
import { SharingSession } from '@/entity/sharingSession';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Service responsible for managing the association between resources and sharing sessions.
 */
export class ReferenceService {
  private referenceRepository = AppDataSource.getRepository(Reference);

  /**
   * Create an association between a resource and a sharing session.
   * @param ressource_uuid - The unique identifier of the resource.
   * @param sharing_session_uuid - The unique identifier of the sharing session.
   * @returns The newly created association.
   */
  async createAssociation(ressource_uuid: string, sharing_session_uuid: string): Promise<Reference> {
    const reference = this.referenceRepository.create({ ressource_uuid, sharing_session_uuid });
    return await this.referenceRepository.save(reference);
  }

  /**
   * Delete an association between a resource and a sharing session.
   * @param ressource_uuid - The unique identifier of the resource.
   * @param sharing_session_uuid - The unique identifier of the sharing session.
   * @returns `true` if the association was deleted, otherwise `false`.
   */
  async deleteAssociation(ressource_uuid: string, sharing_session_uuid: string): Promise<boolean> {
    const result = await this.referenceRepository.delete({ ressource_uuid, sharing_session_uuid });
    return result.affected !== 0;
  }

  /**
   * Retrieve all sharing sessions associated with a specific resource.
   * @param ressource_uuid - The unique identifier of the resource.
   * @returns A list of sharing sessions associated with the resource.
   */
  async getSharingSessionsByRessource(ressource_uuid: string): Promise<SharingSession[]> {
    const resourceAssociations = await this.referenceRepository.find({ where: { ressource_uuid }, relations: ['sharingSession'] });
    if (resourceAssociations.length === 0) {
      throw new EntityNotFoundError('No sharing sessions found for resource with UUID', ressource_uuid);
    }
    return resourceAssociations.map(association => association.sharingSession);
  }

  /**
   * Retrieve all resources associated with a specific sharing session.
   * @param sharing_session_uuid - The unique identifier of the sharing session.
   * @returns A list of resources associated with the sharing session.
   */
  async getRessourcesBySharingSession(sharing_session_uuid: string): Promise<Ressource[]> {
    const sessionAssociations = await this.referenceRepository.find({ where: { sharing_session_uuid }, relations: ['ressource'] });
    if (sessionAssociations.length === 0) {
      throw new EntityNotFoundError('No resources found for sharing session with UUID', sharing_session_uuid);
    }
    return sessionAssociations.map(association => association.ressource);
  }
}
