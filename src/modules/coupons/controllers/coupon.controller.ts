import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto, ApplyCouponDto } from '../dto/coupon.dto';

export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const createCouponDto: CreateCouponDto = req.body;
      const coupon = await this.couponService.createCoupon(createCouponDto);
      res.status(201).json(coupon);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }

  async validateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const code = req.params.code;
      const { cartValue } = req.body;
      const coupon = await this.couponService.validateCoupon(code, cartValue);
      res.status(200).json(coupon);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }

  async applyCouponToOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const applyCouponDto: ApplyCouponDto = req.body;
      const order = { id: orderId, total: applyCouponDto.total || 0 };
      const updatedOrder = await this.couponService.applyCouponToOrder(order, applyCouponDto.code, applyCouponDto.user_id);
      res.status(200).json(updatedOrder);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
  }
}