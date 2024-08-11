import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import type { Relation } from 'typeorm';

/**
 * Represents a follow relationship between two users.
 */
@Entity('follow')
export class Follow {
  // Unique identifier for the user being followed
  @PrimaryColumn('uuid')
  user_uuid!: string;

  // Unique identifier for the follower
  @PrimaryColumn('uuid')
  user_uuid_1!: string;

  // Many-to-one relationship with the User entity for the user being followed
  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'user_uuid' })
  user!: Relation<User>;

  // Many-to-one relationship with the User entity for the follower
  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'user_uuid_1' })
  follower!: Relation<User>;
}
