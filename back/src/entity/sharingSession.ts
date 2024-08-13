import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, Unique } from 'typeorm';
import { User } from './user';
import { Ressource } from './ressource';
import { Tag } from './tag';
import type { Relation } from 'typeorm';

/**
 * Represents a sharing session where resources and tags are shared by users.
 */
@Entity('sharring_session')
@Unique(['title'])
export class SharingSession {
  // Unique identifier for the sharing session
  @PrimaryGeneratedColumn('uuid')
  sharing_session_uuid!: string;

  // Title of the sharing session
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  // Description of the sharing session
  @Column({ type: 'text', nullable: true })
  description!: string;

  // Start date and time of the event
  @Column({ type: 'timestamptz' })
  event_start_datetime!: Date;

  // End date and time of the event
  @Column({ type: 'timestamptz' })
  event_end_datetime!: Date;

  // Timestamp when the sharing session was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Timestamp when the sharing session was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Many-to-one relationship with the User entity (creator of the session)
  @ManyToOne(() => User, (user) => user.sharingSessions)
  @JoinColumn({ name: 'user_uuid' })
  user!: Relation<User>;

  // Many-to-many relationship with the Ressource entity (resources associated with the session)
  @ManyToMany(() => Ressource, (ressource) => ressource.sharingSessions)
  @JoinTable({
    name: 'reference', // Junction table for the relationship
    joinColumn: { name: 'sharing_session_uuid', referencedColumnName: 'sharing_session_uuid' },
    inverseJoinColumn: { name: 'ressource_uuid', referencedColumnName: 'ressource_uuid' }
  })
  ressources!: Relation<Ressource[]>;

  // Many-to-many relationship with the Tag entity (tags associated with the session)
  @ManyToMany(() => Tag, (tag) => tag.sharingSessions)
  @JoinTable({
    name: 'refer', // Junction table for the relationship
    joinColumn: { name: 'sharing_session_uuid', referencedColumnName: 'sharing_session_uuid' },
    inverseJoinColumn: { name: 'tag_uuid', referencedColumnName: 'tag_uuid' }
  })
  tags!: Relation<Tag[]>;
}
