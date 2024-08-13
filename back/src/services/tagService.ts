import { AppDataSource } from "@/data-source";
import { Tag } from "@/entity/tag";
import { EntityNotFoundError, UniqueConstraintViolationError } from "../errors/errors"; 

interface CreateTagDTO {
    tag_title: string;
}

export class TagService {
    /**
     * Retrieves all tags from the database, including associated resources and sharing sessions.
     * @returns A list of all tags.
     * @throws Error if an error occurs while fetching the tags.
     */
    async getAllTags(): Promise<Tag[]> {
        try {
            return await AppDataSource.manager.find(Tag, {
                relations: [
                    'resources',
                    'sharingSessions'
                ],
            });
        } catch (error) {
            console.error("Error fetching tags:", error);
            throw new Error('An error occurred while fetching tags');
        }
    }

    /**
     * Retrieves a specific tag by its UUID.
     * @param tag_uuid - The UUID of the tag to retrieve.
     * @returns The tag corresponding to the UUID or null if not found.
     * @throws Error if an error occurs while fetching the tag.
     */
    async getTagById(tag_uuid: string): Promise<Tag | null> {
        try {
            return await AppDataSource.manager.findOne(Tag, {
                where: { tag_uuid },
                relations: [
                    'resources',
                    'sharingSessions'
                ],
            });
        } catch (error) {
            console.error("Error fetching tag by UUID:", error);
            throw new Error('An error occurred while fetching the tag');
        }
    }

    /**
     * Retrieves a specific tag by its title.
     * @param tag_title - The title of the tag to retrieve.
     * @returns The tag corresponding to the title or null if not found.
     * @throws Error if an error occurs while fetching the tag.
     */
    async getTagByTitle(tag_title: string): Promise<Tag | null> {
        try {
            return await AppDataSource.manager.findOne(Tag, { where: { tag_title } });
        } catch (error) {
            console.error("Error fetching tag by title:", error);
            throw error;
        }
    }

    /**
     * Creates a new tag in the database.
     * @param tagData - The data for the new tag to create.
     * @returns The newly created tag.
     * @throws UniqueConstraintViolationError if the tag title already exists.
     * @throws Error if an error occurs while creating the tag.
     */
    async createTag(tagData: CreateTagDTO): Promise<Tag> {
        try {
            const existingTag = await this.getTagByTitle(tagData.tag_title);
            if (existingTag) {
                throw new UniqueConstraintViolationError('Tag title already exists');
            }

            const tag = AppDataSource.manager.create(Tag, tagData);
            return await AppDataSource.manager.save(tag);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError) {
                throw error; 
            }
            console.error("Error creating tag:", error);
            throw new Error('An error occurred while creating the tag'); 
        }
    }

    /**
     * Replaces an existing tag with new data.
     * @param tag_uuid - The UUID of the tag to replace.
     * @param tagData - The new data for the tag.
     * @returns The updated tag or null if not found.
     * @throws EntityNotFoundError if the tag is not found.
     * @throws UniqueConstraintViolationError if the tag title already exists.
     * @throws Error if an error occurs while replacing the tag.
     */
    async replaceTag(tag_uuid: string, tagData: CreateTagDTO): Promise<Tag | null> {
        try {
            const existingTag = await this.getTagById(tag_uuid);
            if (!existingTag) {
                throw new EntityNotFoundError('Tag', tag_uuid);
            }

            const tagWithSameTitle = await this.getTagByTitle(tagData.tag_title);
            if (tagWithSameTitle && tagWithSameTitle.tag_uuid !== tag_uuid) {
                throw new UniqueConstraintViolationError('Tag title already exists');
            }

            const updatedTag = await AppDataSource.manager.save(Tag, { ...existingTag, ...tagData });
            return updatedTag;
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error replacing tag:", error);
            throw new Error('An error occurred while replacing the tag');
        }
    }

    /**
     * Updates specific fields of an existing tag.
     * @param tag_uuid - The UUID of the tag to update.
     * @param tagData - The partial data for the tag.
     * @returns The updated tag or null if not found.
     * @throws EntityNotFoundError if the tag is not found.
     * @throws UniqueConstraintViolationError if the tag title already exists.
     * @throws Error if an error occurs while updating the tag fields.
     */
    async updateTagFields(tag_uuid: string, tagData: Partial<CreateTagDTO>): Promise<Tag | null> {
        try {
            const existingTag = await this.getTagById(tag_uuid);
            if (!existingTag) {
                throw new EntityNotFoundError('Tag', tag_uuid);
            }

            if (tagData.tag_title) {
                const tagWithSameTitle = await this.getTagByTitle(tagData.tag_title);
                if (tagWithSameTitle && tagWithSameTitle.tag_uuid !== tag_uuid) {
                    throw new UniqueConstraintViolationError('Tag title already exists');
                }
            }

            await AppDataSource.manager.update(Tag, { tag_uuid }, tagData);
            return await this.getTagById(tag_uuid);
        } catch (error) {
            if (error instanceof UniqueConstraintViolationError || error instanceof EntityNotFoundError) {
                throw error;
            }
            console.error("Error updating tag fields:", error);
            throw new Error('An error occurred while updating the tag fields');
        }
    }
    
    /**
     * Deletes a tag from the database by its UUID.
     * @param tag_uuid - The UUID of the tag to delete.
     * @returns A boolean indicating if the deletion was successful.
     * @throws Error if an error occurs while deleting the tag.
     */
    async deleteTag(tag_uuid: string): Promise<boolean> {
        try {
            const result = await AppDataSource.manager.delete(Tag, tag_uuid);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        } catch (error) {
            console.error("Error deleting tag:", error);
            throw error;
        }
    }
}
