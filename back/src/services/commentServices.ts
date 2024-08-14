import { AppDataSource } from '@/data-source';
import { Comment } from '@/entity/comment';
import { EntityNotFoundError, UniqueConstraintViolationError } from '../errors/errors';

interface CreateCommentDTO {
  content?: string;
  is_reported?: boolean;
  parentCommentUuid?: string;
  userUuid: string;
  ressourceUuid: string;
}

export class CommentService {
  /**
   * Retrieves all comments from the database.
   * @returns A list of all comments.
   * @throws Error if an error occurs while fetching the comments.
   */
  async getAllComments(): Promise<Comment[]> {
    try {
      return await AppDataSource.manager.find(Comment, { relations: ['user', 'ressource', 'parentComment', 'replies'] });
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new Error('An error occurred while fetching comments');
    }
  }

  /**
   * Retrieves a specific comment by its UUID.
   * @param comment_uuid - The UUID of the comment to retrieve.
   * @returns The comment corresponding to the UUID or null if not found.
   * @throws Error if an error occurs while fetching the comment.
   */
  async getCommentById(comment_uuid: string): Promise<Comment | null> {
    try {
      return await AppDataSource.manager.findOne(Comment, {
        where: { comment_uuid },
        relations: ['user', 'ressource', 'parentComment', 'replies']
      });
    } catch (error) {
      console.error("Error fetching comment by UUID:", error);
      throw new Error('An error occurred while fetching the comment');
    }
  }

  /**
   * Creates a new comment in the database.
   * @param commentData - The data for the new comment to create.
   * @returns The newly created comment.
   * @throws Error if an error occurs while creating the comment.
   */
  async createComment(commentData: CreateCommentDTO): Promise<Comment> {
    try {
      const comment = AppDataSource.manager.create(Comment, commentData);
      return await AppDataSource.manager.save(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error('An error occurred while creating the comment');
    }
  }

  /**
   * Replaces an existing comment with new data.
   * @param comment_uuid - The UUID of the comment to replace.
   * @param commentData - The new data for the comment.
   * @returns The updated comment or null if not found.
   * @throws EntityNotFoundError if the comment is not found.
   * @throws Error if an error occurs while replacing the comment.
   */
  async replaceComment(comment_uuid: string, commentData: CreateCommentDTO): Promise<Comment | null> {
    try {
      const existingComment = await this.getCommentById(comment_uuid);
      if (!existingComment) {
        throw new EntityNotFoundError('Comment', comment_uuid);
      }

      const updatedComment = await AppDataSource.manager.save(Comment, { ...existingComment, ...commentData });
      return updatedComment;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error replacing comment:", error);
      throw new Error('An error occurred while replacing the comment');
    }
  }

  /**
   * Updates specific fields of an existing comment.
   * @param comment_uuid - The UUID of the comment to update.
   * @param commentData - The partial data for the comment.
   * @returns The updated comment or null if not found.
   * @throws EntityNotFoundError if the comment is not found.
   * @throws Error if an error occurs while updating the comment fields.
   */
  async updateCommentFields(comment_uuid: string, commentData: Partial<CreateCommentDTO>): Promise<Comment | null> {
    try {
      const existingComment = await this.getCommentById(comment_uuid);
      if (!existingComment) {
        throw new EntityNotFoundError('Comment', comment_uuid);
      }

      await AppDataSource.manager.update(Comment, { comment_uuid }, commentData);
      return await this.getCommentById(comment_uuid);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw error;
      }
      console.error("Error updating comment fields:", error);
      throw new Error('An error occurred while updating the comment fields');
    }
  }
  
  /**
   * Deletes a comment from the database by its UUID.
   * @param comment_uuid - The UUID of the comment to delete.
   * @returns A boolean indicating if the deletion was successful.
   * @throws Error if an error occurs while deleting the comment.
   */
  async deleteComment(comment_uuid: string): Promise<boolean> {
    try {
      const result = await AppDataSource.manager.delete(Comment, { comment_uuid });
      return result.affected !== null && result.affected !== undefined && result.affected > 0;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error('An error occurred while deleting the comment');
    }
  }
}
