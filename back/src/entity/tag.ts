import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Ressource } from './ressource';
import type { Relation } from 'typeorm';

/**
 * Represents a tag that can be associated with multiple resources and sharing sessions.
 */
@Entity('tags')
export class Tag {
  // Unique identifier for the tag
  @PrimaryGeneratedColumn('uuid')
  tag_uuid!: string;

  // Title or name of the tag
  @Column({ type: 'varchar', length: 100 })
  tag_title!: string;

  // Timestamp when the tag was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Timestamp when the tag was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Many-to-many relationship with the Ressource entity (resources associated with the tag)
  @ManyToMany(() => Ressource, (ressource) => ressource.tags)
  @JoinTable({
    name: 'have', // Junction table for the relationship
    joinColumn: { name: 'tag_uuid', referencedColumnName: 'tag_uuid' },
    inverseJoinColumn: { name: 'ressource_uuid', referencedColumnName: 'ressource_uuid' }
  })
  ressources!: Relation<Ressource[]>;

  // Placeholder for the sharingSessions relationship
  sharingSessions: any;
}
