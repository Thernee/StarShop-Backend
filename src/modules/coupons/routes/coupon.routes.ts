import { Router } from 'express';
import { CouponService } from '../services/coupon.service';
import { CouponController } from '../controllers/coupon.controller';

const router = Router();
const couponService = new CouponService();
const couponController = new CouponController(couponService);

router.post('/', couponController.createCoupon.bind(couponController));
router.get('/validate/:code', couponController.validateCoupon.bind(couponController));
router.post('/orders/:id/apply-coupon', couponController.applyCouponToOrder.bind(couponController));

export default router;