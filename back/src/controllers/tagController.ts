import { NextApiRequest, NextApiResponse } from "next";
import { TagService } from "../services/tagService";
import Joi from 'joi';
import { EntityNotFoundError, UniqueConstraintViolationError } from "@/errors/errors";

const tagSchema = Joi.object({
  tag_title: Joi.string().required().max(100).messages({
    'string.max': 'Tag title must be less than or equal to 100 characters long',
    'string.empty': 'Tag title is required'
  }),
});

export class TagController {
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  /**
   * Handles the creation of a new tag.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The created tag or an error response.
   */
  async createTag(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { error } = tagSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { tag_title } = req.body;

      const newTag = await this.tagService.createTag({
        tag_title: tag_title.trim()
      });

      return res.status(201).json(newTag);

    } catch (error) {
      if (error instanceof UniqueConstraintViolationError) {
        return res.status(409).json({ error: error.message });
      }

      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Error creating tag:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieves all tags from the database.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of tags or an error response.
   */
  async getAllTags(req: NextApiRequest, res: NextApiResponse) {
    try {
      const tags = await this.tagService.getAllTags();
      res.status(200).json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Error fetching tags" });
    }
  }

  /**
   * Retrieves a tag by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The tag if found, or an error response if not.
   */
  async getTagById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const tag_uuid = req.query.tag_uuid as string;
      if (typeof tag_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag UUID" });
      }

      const tag = await this.tagService.getTagById(tag_uuid);
      if (tag) {
        res.status(200).json(tag);
      } else {
        res.status(404).json({ error: "Tag not found" });
      }
    } catch (error) {
      console.error("Error fetching tag by UUID:", error);
      res.status(500).json({ error: "Error fetching tag by UUID" });
    }
  }

  /**
   * Updates a tag by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The updated tag or an error response if not found.
   */
  async updateTag(req: NextApiRequest, res: NextApiResponse) {
    try {
      const tag_uuid = req.query.tag_uuid as string;
      if (typeof tag_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag UUID" });
      }

      const { tag_title } = req.body;

      const updatedTag = await this.tagService.replaceTag(tag_uuid, {
        tag_title: tag_title ? tag_title.trim() : undefined
      });

      if (updatedTag) {
        res.status(200).json(updatedTag);
      } else {
        res.status(404).json({ error: "Tag not found" });
      }
    } catch (error) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: "Error updating tag" });
    }
  }

  /**
   * Deletes a tag by its UUID.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A 204 status if deletion is successful, or an error response if not found.
   */
  async deleteTag(req: NextApiRequest, res: NextApiResponse) {
    try {
      const tag_uuid = req.query.tag_uuid as string;
      if (typeof tag_uuid !== 'string') {
        return res.status(400).json({ error: "Invalid tag UUID" });
      }

      const success = await this.tagService.deleteTag(tag_uuid);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Tag not found" });
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Error deleting tag" });
    }
  }
}
