import { NextApiRequest, NextApiResponse } from 'next';
import { FollowService } from '@/services/followServices';
import { EntityNotFoundError } from '@/errors/errors';

// Schema for validating follow requests (could be extended with Joi if needed)

/**
 * Controller for handling API requests related to follow relationships between users.
 * This controller provides endpoints to follow/unfollow users, 
 * retrieve a user's followers, and get the list of users that a particular user is following.
 */
export class FollowController {
  private followService: FollowService;

  /**
   * Creates an instance of FollowController.
   * @param followService - Service for managing follow relationships.
   */
  constructor(followService: FollowService) {
    this.followService = followService;
  }

  /**
   * Handles a request to follow a user.
   * Validates the request data and creates a follow relationship.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns The created follow relationship or an error response.
   */
  async followUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { user_uuid, follower_uuid } = req.body;

      if (!user_uuid || !follower_uuid) {
        return res.status(400).json({ error: "User UUID and Follower UUID are required." });
      }

      const follow = await this.followService.followUser(user_uuid, follower_uuid);
      return res.status(201).json(follow);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Error following user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Handles a request to unfollow a user.
   * Validates the request data and deletes the follow relationship.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A success response or an error response.
   */
  async unfollowUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { user_uuid, follower_uuid } = req.body;

      if (!user_uuid || !follower_uuid) {
        return res.status(400).json({ error: "User UUID and Follower UUID are required." });
      }

      const success = await this.followService.unfollowUser(user_uuid, follower_uuid);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: "Follow relationship not found." });
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Error unfollowing user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Handles a request to retrieve all followers of a specific user.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of followers or an error response.
   */
  async getFollowers(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { user_uuid } = req.query;

      if (!user_uuid || typeof user_uuid !== 'string') {
        return res.status(400).json({ error: "Valid user UUID is required." });
      }

      const followers = await this.followService.getFollowers(user_uuid);
      return res.status(200).json(followers);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Error fetching followers:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Handles a request to retrieve all users that a specific user is following.
   * @param req - The API request object.
   * @param res - The API response object.
   * @returns A list of users that the specified user is following or an error response.
   */
  async getFollowing(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { follower_uuid } = req.query;

      if (!follower_uuid || typeof follower_uuid !== 'string') {
        return res.status(400).json({ error: "Valid follower UUID is required." });
      }

      const following = await this.followService.getFollowing(follower_uuid);
      return res.status(200).json(following);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("Error fetching following users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
