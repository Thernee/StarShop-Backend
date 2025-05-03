import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';


const router = Router();

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Cart routes
router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.post('/remove', cartController.removeItem);
router.post('/clear', cartController.clearCart);

export default router;