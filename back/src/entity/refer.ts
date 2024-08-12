import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from './tag';
import { SharingSession } from './sharingSession';
import type { Relation } from 'typeorm';

/**
 * Represents the association between a tag and a sharing session.
 */
@Entity('refer')
export class Refer {
  // Unique identifier for the tag
  @PrimaryColumn('uuid')
  tag_uuid!: string;

  // Unique identifier for the sharing session
  @PrimaryColumn('uuid')
  sharing_session_uuid!: string;

  // Many-to-one relationship with the Tag entity
  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_uuid' })
  tag!: Relation<Tag>;

  // Many-to-one relationship with the SharingSession entity
  @ManyToOne(() => SharingSession)
  @JoinColumn({ name: 'sharing_session_uuid' })
  sharingSession!: Relation<SharingSession>;
}
