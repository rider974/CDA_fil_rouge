// src/entity/user.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, Unique } from 'typeorm';
import { Ressource } from './ressource';
import { Comment } from './comment';
import { SharingSession } from './sharingSession';
import { Follow } from './follow';
import type { Relation } from 'typeorm';


export enum Role {
  ADMIN = "admin",
  MODERATOR = "moderator",
  MEMBER = "member",
  VISITOR = "visitor"
}


@Entity('users')
@Unique(["username"])
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_uuid!: string;

  @Column({type: 'varchar', length: 100 })
  username!: string;

  @Column({type: 'varchar', length: 100 })
  email!: string;

  @Column({type: 'varchar', length: 255 })
  password!: string;

  @Column({type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({
    type: "enum",
    enum: Role,
  })
  role!: Role


  @OneToMany(() => Ressource, (ressource) => ressource.user)
  ressources!: Relation<Ressource[]>;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Relation<Comment[]>;

  @OneToMany(() => SharingSession, (sharingSession) => sharingSession.user)
  sharingSessions!: Relation<SharingSession[]>;

  @ManyToMany(() => Follow, (follow) => follow.user)
  following!: Relation<Follow[]>;

  @ManyToMany(() => Follow, (follow) => follow.follower)
  followers!: Relation<Follow[]>;
}
export default User;
