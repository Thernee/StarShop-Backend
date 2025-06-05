import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { validateRequest } from '../../middleware/validation.middleware';
import { NotificationDto, UserNotificationDto } from '../dto/notification.dto';
import { NotificationService } from '../services/notification.service';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedRequest } from '../../shared/types/auth-request.type';
import { jwtAuthMiddleware } from '../../auth/middleware/jwt-auth.middleware';
import { asyncHandler } from '../../middleware/async-handler';

const router = Router();
const configService = new ConfigService();
const notificationService = new NotificationService(configService);
const notificationController = new NotificationController(notificationService);

router.use(jwtAuthMiddleware);

router.post(
  '/send-to-user',
  validateRequest(UserNotificationDto),
  asyncHandler((req, res) => notificationController.sendToUser(req as AuthenticatedRequest, res))
);

router.post(
  '/broadcast',
  validateRequest(NotificationDto),
  asyncHandler((req, res) => notificationController.broadcast(req as AuthenticatedRequest, res))
);

export default router;
