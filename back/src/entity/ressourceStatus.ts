import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Ressource } from './ressource';
import type { Relation } from 'typeorm';

/**
 * Represents the status of a resource.
 */
@Entity('ressources-status')
export class RessourceStatus {
  // Unique identifier for the resource status
  @PrimaryGeneratedColumn('uuid')
  ressource_status_uuid!: string;

  // Name of the resource status
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  // Timestamp when the resource status was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Timestamp when the resource status was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // One-to-many relationship with the Ressource entity
  @OneToMany(() => Ressource, (ressource) => ressource.ressourceStatus)
  ressources!: Relation<Ressource[]>;
}
