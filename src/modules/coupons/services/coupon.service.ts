import { DataSource, Repository } from 'typeorm';
import { Coupon, CouponUsage } from '../entities/coupon.entity';
import { CouponType } from '../dto/coupon.dto';
import { CreateCouponDto } from '../dto/coupon.dto';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://URL',
  entities: ['src/modules/coupons/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: true,
});

export class CouponService {
  private couponRepository: Repository<Coupon>;
  private couponUsageRepository: Repository<CouponUsage>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.couponRepository = dataSource.getRepository(Coupon);
    this.couponUsageRepository = dataSource.getRepository(CouponUsage);
  }

  async createCoupon(data: CreateCouponDto): Promise<Coupon> {
    const coupon = this.couponRepository.create(data);
    return this.couponRepository.save(coupon);
  }

  async validateCoupon(code: string, cartValue: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { code } });
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    if (coupon.expires_at && new Date() > coupon.expires_at) {
      throw new Error('Coupon has expired');
    }

    if (coupon.min_cart_value && cartValue < coupon.min_cart_value) {
      throw new Error('Cart value is below minimum required');
    }

    if (coupon.max_uses) {
      const usageCount = await this.couponUsageRepository.count({ where: { coupon_id: coupon.id } });
      if (usageCount >= coupon.max_uses) {
        throw new Error('Coupon usage limit reached');
      }
    }

    return coupon;
  }

  async applyCouponToOrder(order: { id: string; total: number }, code: string, user_id: string): Promise<{ id: string; total: number; discount: number }> {
    const coupon = await this.validateCoupon(code, order.total);
    let discount = 0;

    if (coupon.type === CouponType.PERCENTAGE) {
      discount = (order.total * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    const updatedOrder = {
      ...order,
      discount,
      total: order.total - discount,
    };

    const couponUsage = this.couponUsageRepository.create({
      coupon_id: coupon.id,
      user_id,
    });
    await this.couponUsageRepository.save(couponUsage);

    return updatedOrder;
  }
}

