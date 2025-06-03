import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes';
import cartRoutes from '../modules/cart/routes/cart.routes';
import orderRoutes from '../modules/orders/routes/order.routes';
import productRoutes from '../modules/products/routes/product.routes';
import reviewRoutes from '../modules/reviews/routes/review.routes';
// import wishlistRoutes from '../modules/wishlist/routes/wishlist.routes';
import notificationRoutes from '../modules/notifications/routes/notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
// router.use('/wishlist', wishlistRoutes);
router.use('/notifications', notificationRoutes);

export default router;
