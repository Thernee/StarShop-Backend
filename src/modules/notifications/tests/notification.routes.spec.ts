import request from 'supertest';
import express, { Express } from 'express';
import notificationRoutes from '../routes/notification.routes';
import { NotificationService } from '../services/notification.service';
import { Role } from '../../../types/role';

describe('Notification Routes', () => {
  let app: Express;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    notificationService = {
      sendNotificationToUser: jest.fn().mockResolvedValue(true),
      broadcastNotification: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<NotificationService>;

    app = express();
    app.use(express.json());
    app.use('/notifications', notificationRoutes);
  });

  describe('POST /notifications/send-to-user', () => {
    it('should send notification to user when user is admin', async () => {
      const notification = {
        userId: '123',
        title: 'Test',
        message: 'Test message',
        type: 'info',
      };

      const response = await request(app)
        .post('/notifications/send-to-user')
        .set('Authorization', 'Bearer mock-token')
        .send(notification);

      expect(response.status).toBe(200);
      expect(notificationService.sendNotificationToUser).toHaveBeenCalledWith(notification);
    });

    it('should return 400 for invalid notification data', async () => {
      const invalidNotification = {
        userId: '123',
        // Missing required fields
      };

      const response = await request(app)
        .post('/notifications/send-to-user')
        .set('Authorization', 'Bearer mock-token')
        .send(invalidNotification);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /notifications/broadcast', () => {
    it('should broadcast notification when user is admin', async () => {
      const notification = {
        title: 'Test',
        message: 'Test message',
        type: 'info',
      };

      const response = await request(app)
        .post('/notifications/broadcast')
        .set('Authorization', 'Bearer mock-token')
        .send(notification);

      expect(response.status).toBe(200);
      expect(notificationService.broadcastNotification).toHaveBeenCalledWith(notification);
    });

    it('should return 400 for invalid notification data', async () => {
      const invalidNotification = {
        // Missing required fields
      };

      const response = await request(app)
        .post('/notifications/broadcast')
        .set('Authorization', 'Bearer mock-token')
        .send(invalidNotification);

      expect(response.status).toBe(400);
    });
  });

  describe('Role-based access control', () => {
    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.use((req, res, next) => {
        req.user = {
          id: '1',
          walletAddress: '0x123',
          role: [Role.USER],
        };
        next();
      });
      app.use('/notifications', notificationRoutes);
    });

    it('should return 403 when non-admin tries to send notification', async () => {
      const notification = {
        userId: '123',
        title: 'Test',
        message: 'Test message',
        type: 'info',
      };

      const response = await request(app)
        .post('/notifications/send-to-user')
        .set('Authorization', 'Bearer mock-token')
        .send(notification);

      expect(response.status).toBe(403);
    });

    it('should return 403 when non-admin tries to broadcast', async () => {
      const notification = {
        title: 'Test',
        message: 'Test message',
        type: 'info',
      };

      const response = await request(app)
        .post('/notifications/broadcast')
        .set('Authorization', 'Bearer mock-token')
        .send(notification);

      expect(response.status).toBe(403);
    });
  });
});
