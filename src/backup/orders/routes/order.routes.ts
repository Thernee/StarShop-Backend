import { Router } from 'express';
import { OrderController } from '../../../modules/orders/controllers/order.controller';
import { OrderService } from '../../../modules/orders/services/order.service';
import { jwtAuthMiddleware } from '../../../modules/auth/middleware/jwt-auth.middleware';
import AppDataSource from '../../../config/ormconfig';
import { Order } from '../../../modules/orders/entities/order.entity';
import { AuthenticatedRequest } from '../../../modules/shared/types/auth-request.type';

const router = Router();
const orderService = new OrderService(AppDataSource.getRepository(Order));
const orderController = new OrderController(orderService);

// Apply auth middleware to all routes
router.use('/', jwtAuthMiddleware);

// Get all orders for the authenticated user
router.get('/', async (req, res, next) => {
  try {
    const orders = await orderController.getOrders(req as AuthenticatedRequest);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get specific order details
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderController.getOrderDetails(req.params.id, req as AuthenticatedRequest);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
