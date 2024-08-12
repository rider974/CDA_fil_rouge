import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ressource } from './ressource';
import type { Relation } from 'typeorm';

/**
 * Represents the history of status changes for a resource.
 */
@Entity('ressources-status-history')
export class RessourceStatusHistory {
  // Unique identifier for the resource status history record
  @PrimaryGeneratedColumn('uuid')
  ressource_status_history_uuid!: string;

  // Timestamp when the status change occurred
  @Column({ type: 'timestamptz' })
  status_changed_at!: Date;

  // Preview of the resource status before the change
  @Column({ type: 'varchar', length: 50, nullable: true })
  preview_state!: string;

  // New state of the resource status after the change
  @Column({ type: 'varchar', length: 50, nullable: true })
  new_state!: string;

  // Timestamp when the resource status history record was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Timestamp when the resource status history record was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Many-to-one relationship with the Ressource entity
  @ManyToOne(() => Ressource, (ressource) => ressource.statusHistory)
  @JoinColumn({ name: 'ressource_uuid' })
  ressource!: Relation<Ressource>;
}
