import { AppDataSource } from '@/data-source';
import { Comment } from '@/entity/comment';
import { EntityNotFoundError, UniqueConstraintViolationError } from '../errors/errors';
import { Ressource } from '@/entity/ressource';

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
  public async getAllComments(): Promise<Comment[]> {
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
  public async getCommentById(comment_uuid: string): Promise<Comment | null> {
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
  public async createComment(commentData: CreateCommentDTO): Promise<Comment> {
    try {
      if(! (await this.verifyValidityCommentData(commentData?.content)))
      {
        throw new Error('The comment is too long ');
      }

      // verify the ressource is created and publish
      if(! (await this.verifyRessourceExistPublish(commentData?.ressourceUuid)))
      {
        throw new Error('The ressource does not exist or is not publish');
      }

      if(! (await this.verifyParentComment(commentData?.parentCommentUuid, commentData?.ressourceUuid)))
      {
        throw new Error('The parent comment does not exist or is reported');
      }

      const comment = AppDataSource.manager.create(Comment, commentData);
      return await AppDataSource.manager.save(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error('An error occurred while creating the comment');
    }
  }
  
   /**
   * Verify the ressource exists and is publish
   * @param {string} ressourceUuid - uuid of the ressource which the comment is link  
   * @returns {boolean} - true if the ressource linked is publish
   */
   private async verifyRessourceExistPublish(ressourceUuid : string): Promise<boolean>
   {
    try 
    {
      const ressource = await AppDataSource?.manager?.findOne(Ressource, {
        relations: ['ressourceStatus'],
        where :  {
          ressource_uuid : ressourceUuid}
        });
      
      if(!ressource) return false; 

      if(ressource?.ressourceStatus?.name !== "publish") return false; 

      return true;
    }
    catch (error) {
      console.error("Error fetching ressource:", error);
      throw new Error('An error occurred while fetching the comment\'s ressource');
    }
   }

  /**
   * Verify the Parent comment isn't reported, link to the same ressource as the comment
   * @param {string} commentParentUuid - uuid of the ressource which the comment is link  
   * @param {string} ressource_uuid - uuid of the ressource which the comment is link  
   * @returns {boolean} - true if the comment does not exist
   */
    private async verifyParentComment(commentParentUuid : string| undefined, ressource_uuid : string): Promise<boolean>
    {
      try 
      {
        // the parent comment does not exist 
        if(!commentParentUuid || commentParentUuid?.trim()?.length == 0) return true; 

        const commentParent = await AppDataSource?.manager?.findOne(Comment,{
          relations: ['ressource'],
          where :  {
            comment_uuid : commentParentUuid}
          });
        
        if(!commentParent) return false; 

        if(commentParent?.is_reported) return false; 

        // verify the same ressource as the comment 
        if(ressource_uuid !== commentParent?.ressource?.ressource_uuid) return false; 

        return true;
      }
      catch (error) {
        console?.error("Error fetching ressource:", error);
        throw new Error('An error occurred while fetching the comment\'s ressource');
      }
    }

   /**
   * Verify the content exists and is not too long for the database field
   * @param {string} contentComment -  content of the comment  
   * @returns {boolean} - true if the content  exists and length <= 255 and content is not empty  
   */
  private verifyValidityCommentData(contentComment : string | undefined): boolean
  {
    return contentComment?.length !== undefined && contentComment?.length  <= 255 && contentComment?.trim()?.length > 0;
  }

  /**
   * Replaces an existing comment with new data.
   * @param comment_uuid - The UUID of the comment to replace.
   * @param commentData - The new data for the comment.
   * @returns The updated comment or null if not found.
   * @throws EntityNotFoundError if the comment is not found.
   * @throws Error if an error occurs while replacing the comment.
   */
  public async replaceComment(comment_uuid: string, commentData: CreateCommentDTO): Promise<Comment | null> {
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
  public async updateCommentFields(comment_uuid: string, commentData: Partial<CreateCommentDTO>): Promise<Comment | null> {
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
  public async deleteComment(comment_uuid: string): Promise<boolean> {
    try {
      const result = await AppDataSource.manager.delete(Comment, { comment_uuid });
      return result.affected !== null && result.affected !== undefined && result.affected > 0;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error('An error occurred while deleting the comment');
    }
  }
}
