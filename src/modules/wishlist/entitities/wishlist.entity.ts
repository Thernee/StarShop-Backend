import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../entities/User';
import { Product } from '../../../entities/Product'; // adjust based on your path

@Entity('wishlist')
@Unique(['user', 'product'])
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
