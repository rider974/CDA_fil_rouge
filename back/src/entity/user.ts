import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, Unique } from 'typeorm';
import { Role } from './role';
import { Ressource } from './ressource';
import { Comment } from './comment';
import { SharingSession } from './sharingSession';
import { Follow } from './follow';
import type { Relation } from 'typeorm';

/**
 * Represents a user in the system with various roles, resources, comments, and relationships.
 */
@Entity('users')
@Unique(["username"]) // Ensures that each username is unique
@Unique(["email"]) // Ensures that each email is unique
export class User {
  // Unique identifier for the user
  @PrimaryGeneratedColumn('uuid')
  user_uuid!: string;

  // Username for the user
  @Column({ type: 'varchar', length: 100 })
  username!: string;

  // Email address of the user
  @Column({ type: 'varchar', length: 100 })
  email!: string;

  // Password for the user account
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  // Indicates whether the user account is active
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  // Timestamp when the user was created
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Timestamp when the user was last updated
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // Many-to-one relationship with the Role entity (the role assigned to the user)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_uuid' })
  role!: Relation<Role>;

  // One-to-many relationship with the Ressource entity (resources created by the user)
  @OneToMany(() => Ressource, (ressource) => ressource.user)
  ressources!: Relation<Ressource[]>;

  // One-to-many relationship with the Comment entity (comments made by the user)
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Relation<Comment[]>;

  // One-to-many relationship with the SharingSession entity (sharing sessions created by the user)
  @OneToMany(() => SharingSession, (sharingSession) => sharingSession.user)
  sharingSessions!: Relation<SharingSession[]>;

  // Many-to-many relationship with the Follow entity (users whom this user follows)
  @ManyToMany(() => Follow, (follow) => follow.user)
  following!: Relation<Follow[]>;

  // Many-to-many relationship with the Follow entity (users who follow this user)
  @ManyToMany(() => Follow, (follow) => follow.follower)
  followers!: Relation<Follow[]>;
}

export default User;
