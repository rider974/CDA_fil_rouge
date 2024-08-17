import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { Ressource } from './ressource';
import type { Relation } from 'typeorm';

/**
 * Represents the type of a resource.
 */
@Entity('ressource-type')
@Unique(['type_name'])
export class RessourceType {
  // Unique identifier for the resource type
  @PrimaryGeneratedColumn('uuid')
  ressource_type_uuid!: string;

  // Name of the resource type
  @Column({ type: 'varchar', length: 50 })
  type_name!: string;

  // Timestamp when the resource type was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Timestamp when the resource type was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // One-to-many relationship with the Ressource entity
  @OneToMany(() => Ressource, (ressource) => ressource.ressourceType)
  ressources!: Relation<Ressource[]>;
}
