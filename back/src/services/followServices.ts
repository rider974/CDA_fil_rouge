import { AppDataSource } from '@/data-source';
import { Follow } from '@/entity/follow';
import { User } from '@/entity/user';
import { EntityNotFoundError } from '@/errors/errors';

/**
 * Service for managing follow relationships between users.
 * This service provides methods to follow/unfollow users, retrieve followers, 
 * and get the list of users that a particular user is following.
 */
export class FollowService {
  private followRepository = AppDataSource.getRepository(Follow);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Allows a user to follow another user.
   * @param userUuid - The UUID of the user who will be followed.
   * @param followerUuid - The UUID of the user who wants to follow.
   * @returns The newly created follow relationship.
   */
  async followUser(userUuid: string, followerUuid: string): Promise<Follow> {
    // Ensure the user to be followed exists
    const user = await this.userRepository.findOne({ where: { user_uuid: userUuid } });
    if (!user) {
      throw new EntityNotFoundError('User to follow not found',userUuid);
    }

    // Ensure the follower exists
    const follower = await this.userRepository.findOne({ where: { user_uuid: followerUuid } });
    if (!follower) {
      throw new EntityNotFoundError('Follower user not found',userUuid);
    }

    // Create the follow relationship
    const follow = new Follow();
    follow.user_uuid = userUuid;
    follow.user_uuid_1 = followerUuid;
    follow.user = user;
    follow.follower = follower;

    // Save the follow relationship to the database
    return await this.followRepository.save(follow);
  }

  /**
   * Allows a user to unfollow another user.
   * @param userUuid - The UUID of the user to unfollow.
   * @param followerUuid - The UUID of the user who wants to unfollow.
   * @returns A boolean indicating whether the unfollow operation was successful.
   */
  async unfollowUser(userUuid: string, followerUuid: string): Promise<boolean> {
    // Find the follow relationship
    const follow = await this.followRepository.findOne({
      where: { user_uuid: userUuid, user_uuid_1: followerUuid }
    });

    if (!follow) {
      throw new EntityNotFoundError('Follow relationship not found',userUuid);
    }

    // Delete the follow relationship from the database
    await this.followRepository.remove(follow);
    return true;
  }

  /**
   * Retrieves all followers of a specific user.
   * @param userUuid - The UUID of the user whose followers are to be retrieved.
   * @returns A list of users following the specified user.
   */
  async getFollowers(userUuid: string): Promise<User[]> {
    // Ensure the user exists
    const user = await this.userRepository.findOne({ where: { user_uuid: userUuid } });
    if (!user) {
      throw new EntityNotFoundError('User not found',userUuid);
    }

    // Find all followers of the user
    const followers = await this.followRepository.find({
      where: { user_uuid: userUuid },
      relations: ['follower'],
    });

    // Return the list of followers
    return followers.map((follow) => follow.follower);
  }

  /**
   * Retrieves all users that a specific user is following.
   * @param followerUuid - The UUID of the user whose followings are to be retrieved.
   * @returns A list of users that the specified user is following.
   */
  async getFollowing(followerUuid: string): Promise<User[]> {
    // Ensure the follower exists
    const user = await this.userRepository.findOne({ where: { user_uuid: followerUuid } });
    if (!user) {
      throw new EntityNotFoundError('User not found',followerUuid);
    }

    // Find all users that the follower is following
    const following = await this.followRepository.find({
      where: { user_uuid_1: followerUuid },
      relations: ['user'],
    });

    // Return the list of followed users
    return following.map((follow) => follow.user);
  }
}
