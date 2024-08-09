// src/entity/refer.ts
import {  Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from './tag';
import { SharingSession } from './sharingSession';
import type {Relation} from 'typeorm'
@Entity('refer')
export class Refer {
  @PrimaryColumn('uuid')
  tag_uuid!: string;

  @PrimaryColumn('uuid')
  sharing_session_uuid!: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_uuid' })
  tag!: Relation<Tag>;

  @ManyToOne(() => SharingSession)
  @JoinColumn({ name: 'sharing_session_uuid' })
  sharingSession!: Relation<SharingSession>;
}
