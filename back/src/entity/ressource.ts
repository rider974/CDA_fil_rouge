import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, Unique, JoinTable } from 'typeorm';
import { User } from './user';
import { RessourceType } from './ressourceType';
import { RessourceStatus } from './ressourceStatus';
import { Comment } from './comment';
import { Tag } from './tag';
import { RessourceStatusHistory } from './ressourceStatusHistory';
import type { Relation } from 'typeorm';
import { SharingSession } from './sharingSession';

/**
 * Represents a resource with its metadata and relationships.
 */
@Entity('ressources')
@Unique(['title'])
export class Ressource {
  // Unique identifier for the resource
  @PrimaryGeneratedColumn('uuid')
  ressource_uuid!: string;

  // Title of the resource
  @Column({ type: 'varchar', length: 50 })
  title!: string;

  // Main content of the resource
  @Column({ type: 'text', nullable: true })
  content!: string;

  // Brief summary or description of the resource
  @Column({ type: 'varchar', length: 255, nullable: true })
  summary!: string;

  // Indicates if the resource has been reported
  @Column({ default: false })
  is_reported!: boolean;

  // Date and time when the resource was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Date and time when the resource was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Many-to-one relationship with the User who created the resource
  @ManyToOne(() => User, (user) => user.ressources)
  @JoinColumn({ name: 'user_uuid' })
  user!: Relation<User>;

  // Many-to-one relationship with the RessourceType
  @ManyToOne(() => RessourceType, (ressourceType) => ressourceType.ressources)
  @JoinColumn({ name: 'ressource_type_uuid' })
  ressourceType!: Relation<RessourceType>;

  // Many-to-one relationship with the RessourceStatus
  @ManyToOne(() => RessourceStatus, (ressourceStatus) => ressourceStatus.ressources)
  @JoinColumn({ name: 'ressource_status_uuid' })
  ressourceStatus!: Relation<RessourceStatus>;

  // Many-to-one relationship with the User who last updated the resource
  @ManyToOne(() => User, (user) => user.ressources)
  @JoinColumn({ name: 'user_uuid_1' })
  updatedBy!: Relation<User>;

  // One-to-many relationship with comments associated with the resource
  @OneToMany(() => Comment, (comment) => comment.ressource)
  comments!: Relation<Comment[]>;

  // One-to-many relationship with the status history of the resource
  @OneToMany(() => RessourceStatusHistory, (statusHistory) => statusHistory.ressource)
  statusHistory!: Relation<RessourceStatusHistory[]>;

  // Many-to-many relationship with tags associated with the resource
  @ManyToMany(() => Tag, (tag) => tag.ressources)
  @JoinTable({
  name: 'have', // Junction table for the relationship
  joinColumn: { name: 'ressource_uuid', referencedColumnName: 'ressource_uuid' },
  inverseJoinColumn: { name: 'tag_uuid', referencedColumnName: 'tag_uuid' }
  })
  tags!: Relation<Tag[]>;

  // Many-to-many relationship with sharing sessions associated with the resource
  @ManyToMany(() => SharingSession, (sharingSession) => sharingSession.ressources)
  @JoinTable({
    name: 'reference', // Junction table for the relationship
    joinColumn: { name: 'ressource_uuid', referencedColumnName: 'ressource_uuid' },
    inverseJoinColumn: { name: 'sharing_session_uuid', referencedColumnName: 'sharing_session_uuid' }
  })
  sharingSessions!: Relation<SharingSession[]>;

}
