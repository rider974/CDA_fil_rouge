import { AppDataSource } from '@/data-source';
import { Refer } from '@/entity/refer';
import { SharingSession } from '@/entity/sharingSession';
import { Tag } from '@/entity/tag';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Service responsible for managing the association between tags and sharing sessions.
 */
export class ReferService {
  private referRepository = AppDataSource.getRepository(Refer);

  /**
   * Create an association between a tag and a sharing session.
   * @param tag_uuid - The unique identifier of the tag.
   * @param sharing_session_uuid - The unique identifier of the sharing session.
   * @returns The newly created association.
   */
  async createAssociation(tag_uuid: string, sharing_session_uuid: string): Promise<Refer> {
    const refer = this.referRepository.create({ tag_uuid, sharing_session_uuid });
    return await this.referRepository.save(refer);
  }

  /**
   * Delete an association between a tag and a sharing session.
   * @param tag_uuid - The unique identifier of the tag.
   * @param sharing_session_uuid - The unique identifier of the sharing session.
   * @returns `true` if the association was deleted, otherwise `false`.
   */
  async deleteAssociation(tag_uuid: string, sharing_session_uuid: string): Promise<boolean> {
    const result = await this.referRepository.delete({ tag_uuid, sharing_session_uuid });
    return result.affected !== 0;
  }

  /**
   * Retrieve all sharing sessions associated with a specific tag.
   * @param tag_uuid - The unique identifier of the tag.
   * @returns A list of sharing sessions associated with the tag.
   */
  async getSharingSessionsByTag(tag_uuid: string): Promise<SharingSession[]> {
    const tagAssociations = await this.referRepository.find({ where: { tag_uuid }, relations: ['sharingSession'] });
    if (tagAssociations.length === 0) {
      throw new EntityNotFoundError('No sharing sessions found for tag with UUID',tag_uuid);
    }
    return tagAssociations.map(association => association.sharingSession);
  }

  /**
   * Retrieve all tags associated with a specific sharing session.
   * @param sharing_session_uuid - The unique identifier of the sharing session.
   * @returns A list of tags associated with the sharing session.
   */
  async getTagsBySharingSession(sharing_session_uuid: string): Promise<Tag[]> {
    const sessionAssociations = await this.referRepository.find({ where: { sharing_session_uuid }, relations: ['tag'] });
    if (sessionAssociations.length === 0) {
      throw new EntityNotFoundError('No tags found for sharing session with UUID', sharing_session_uuid);
    }
    return sessionAssociations.map(association => association.tag);
  }
}
