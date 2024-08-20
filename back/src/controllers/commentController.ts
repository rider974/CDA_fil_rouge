import { NextApiRequest, NextApiResponse } from 'next';
import Joi from 'joi';
import { CommentService } from '@/services/commentServices';
import { EntityNotFoundError } from '../errors/errors';

// Schema for validating comment creation and updates
const commentSchema = Joi.object({
  content: Joi.string().required(),
  is_reported: Joi.boolean().optional(),
  parentCommentUuid: Joi.string().uuid().optional(),
  userUuid: Joi.string().uuid().required(),
  ressourceUuid: Joi.string().uuid().required(),
});

export class CommentController {
  private commentService: CommentService;

  public constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  public async createComment(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { error } = commentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const newComment = await this.commentService.createComment(req.body);
      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getAllComments(req: NextApiRequest, res: NextApiResponse) {
    try {
      const comments = await this.commentService.getAllComments();
      return res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Error fetching comments" });
    }
  }

  public async getCommentById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { comment_uuid } = req.query;
      if (typeof comment_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid comment UUID" });
      }

      const comment = await this.commentService.getCommentById(comment_uuid);
      if (comment) {
        return res.status(200).json(comment);
      } else {
        return res.status(404).json({ error: "Comment not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error retrieving comment by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async replaceComment(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { comment_uuid } = req.query;
      if (typeof comment_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid comment UUID" });
      }

      const { error } = commentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const updatedComment = await this.commentService.replaceComment(comment_uuid, req.body);
      if (updatedComment) {
        return res.status(200).json(updatedComment);
      } else {
        return res.status(404).json({ error: "Comment not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error replacing comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async updateCommentFields(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { comment_uuid } = req.query;
      if (typeof comment_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid comment UUID" });
      }

      const { error } = commentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const updatedComment = await this.commentService.updateCommentFields(comment_uuid, req.body);
      if (updatedComment) {
        return res.status(200).json(updatedComment);
      } else {
        return res.status(404).json({ error: "Comment not found" });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("Error updating comment fields:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async deleteComment(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { comment_uuid } = req.query;
      if (typeof comment_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid comment UUID" });
      }

      const success = await this.commentService.deleteComment(comment_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Comment not found" });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
