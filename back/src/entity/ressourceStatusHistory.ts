import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ressource } from './ressource';
import { RessourceStatus } from './ressourceStatus';
import type { Relation } from 'typeorm';

/**
 * Represents the history of status changes for a resource.
 */
@Entity('ressources_status_history')
export class RessourceStatusHistory {
  // Unique identifier for the resource status history record
  @PrimaryGeneratedColumn('uuid')
  ressource_status_history_uuid!: string;

  // Timestamp when the status change occurred
  @Column({ type: 'timestamptz' })
  status_changed_at!: Date;

  // Previous state of the resource status before the change
  @ManyToOne(() => RessourceStatus)
  @JoinColumn({ name: 'preview_state_uuid' })
  preview_state!: Relation<RessourceStatus>;

  // New state of the resource status after the change
  @ManyToOne(() => RessourceStatus)
  @JoinColumn({ name: 'new_state_uuid' })
  new_state!: Relation<RessourceStatus>;

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
