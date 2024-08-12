import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ressource } from './ressource';
import { SharingSession } from './sharingSession';
import type { Relation } from 'typeorm';

/**
 * Represents the association between a resource and a sharing session.
 */
@Entity('reference')
export class Reference {
  // Unique identifier for the resource
  @PrimaryColumn('uuid')
  ressource_uuid!: string;

  // Unique identifier for the sharing session
  @PrimaryColumn('uuid')
  sharing_session_uuid!: string;

  // Many-to-one relationship with the Ressource entity
  @ManyToOne(() => Ressource)
  @JoinColumn({ name: 'ressource_uuid' })
  ressource!: Relation<Ressource>;

  // Many-to-one relationship with the SharingSession entity
  @ManyToOne(() => SharingSession)
  @JoinColumn({ name: 'sharing_session_uuid' })
  sharingSession!: Relation<SharingSession>;
}
