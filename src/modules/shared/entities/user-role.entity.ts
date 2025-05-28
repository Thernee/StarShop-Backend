import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('user_roles')
export class UserRole {
  @Column()
  userId: string;

  @Column()
  roleId: string;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
