import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from './tag';
import { Ressource } from './ressource';
import type { Relation } from 'typeorm';

/**
 * Represents the association between a tag and a resource.
 */
@Entity('have')
export class Have {
  // Unique identifier for the tag
  @PrimaryColumn('uuid')
  tag_uuid!: string;

  // Unique identifier for the resource
  @PrimaryColumn('uuid')
  ressource_uuid!: string;

  // Many-to-one relationship with the Tag entity
  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_uuid' })
  tag!: Relation<Tag>;

  // Many-to-one relationship with the Ressource entity
  @ManyToOne(() => Ressource)
  @JoinColumn({ name: 'ressource_uuid' })
  ressource!: Relation<Ressource>;
}
