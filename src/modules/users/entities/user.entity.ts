import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  walletAddress: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany('UserRole', (userRole: any) => userRole.user)
  userRoles: any[];
}
