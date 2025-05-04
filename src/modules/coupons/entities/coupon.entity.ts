import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CouponType } from '../dto/coupon.dto';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'varchar', enum: CouponType })
  type: CouponType;

  @Column('decimal')
  value: number;

  @Column('decimal', { nullable: true })
  min_cart_value?: number;

  @Column({ type: 'datetime', nullable: true })
  expires_at?: Date;

  @Column({ nullable: true })
  max_uses?: number;

  @Column()
  created_by: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class CouponUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coupon_id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  usedAt: Date;
}