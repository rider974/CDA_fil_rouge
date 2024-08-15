import { AppDataSource } from '@/data-source';
import { Have } from '@/entity/have';
import { Ressource } from '@/entity/ressource';
import { Tag } from '@/entity/tag';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Service responsible for managing the association between tags and resources.
 */
export class HaveService {
  private haveRepository = AppDataSource.getRepository(Have);

  /**
   * Create an association between a tag and a resource.
   * @param tag_uuid - The unique identifier of the tag.
   * @param ressource_uuid - The unique identifier of the resource.
   * @returns The newly created association.
   */
  async createAssociation(tag_uuid: string, ressource_uuid: string): Promise<Have> {
    const have = this.haveRepository.create({ tag_uuid, ressource_uuid });
    return await this.haveRepository.save(have);
  }

  /**
   * Delete an association between a tag and a resource.
   * @param tag_uuid - The unique identifier of the tag.
   * @param ressource_uuid - The unique identifier of the resource.
   * @returns `true` if the association was deleted, otherwise `false`.
   */
  async deleteAssociation(tag_uuid: string, ressource_uuid: string): Promise<boolean> {
    const result = await this.haveRepository.delete({ tag_uuid, ressource_uuid });
    return result.affected !== 0;
  }

  /**
   * Retrieve all resources associated with a specific tag.
   * @param tag_uuid - The unique identifier of the tag.
   * @returns A list of resources associated with the tag.
   */
  async getResourcesByTag(tag_uuid: string): Promise<Ressource[]> {
    const tagAssociations = await this.haveRepository.find({ where: { tag_uuid }, relations: ['ressource'] });
    if (tagAssociations.length === 0) {
      throw new EntityNotFoundError('No resources found for tag with UUID ',tag_uuid);
    }
    return tagAssociations.map(association => association.ressource);
  }

  /**
   * Retrieve all tags associated with a specific resource.
   * @param ressource_uuid - The unique identifier of the resource.
   * @returns A list of tags associated with the resource.
   */
  async getTagsByResource(ressource_uuid: string): Promise<Tag[]> {
    const ressourceAssociations = await this.haveRepository.find({ where: { ressource_uuid }, relations: ['tag'] });
    if (ressourceAssociations.length === 0) {
      throw new EntityNotFoundError('No tags found for resource with UUID', ressource_uuid);
    }
    return ressourceAssociations.map(association => association.tag);
  }
}
