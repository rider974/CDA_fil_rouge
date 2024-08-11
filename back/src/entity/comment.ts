import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { User } from './user';
import { Ressource } from './ressource';

/**
 * Represents a comment on a resource, with optional replies.
 */
@Entity('comments')
export class Comment {
  // Unique identifier for the comment
  @PrimaryGeneratedColumn('uuid')
  comment_uuid!: string;

  // Content of the comment
  @Column({ length: 255, nullable: true })
  content!: string;

  // Indicates if the comment has been reported
  @Column({ default: false })
  is_reported!: boolean;

  // Date and time when the comment was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Date and time when the comment was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Self-referencing many-to-one relationship for parent comments
  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'comment_uuid_1' })
  parentComment!: Comment;

  // Many-to-one relationship with the User who wrote the comment
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_uuid' })
  user!: Relation<User>;

  // Many-to-one relationship with the Ressource on which the comment was made
  @ManyToOne(() => Ressource, (ressource) => ressource.comments)
  @JoinColumn({ name: 'ressource_uuid' })
  ressource!: Relation<Ressource>;

  // One-to-many relationship for replies to the comment
  replies!: Comment[];
}
