import { Router } from 'express';
import { jwtAuthMiddleware } from '../../../modules/auth/middleware/jwt-auth.middleware';
import { AuthController } from '../../../modules/auth/controllers/auth.controller';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { UserService } from '../../../modules/users/services/user.service';
import { RoleService } from '../../../modules/auth/services/role.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../../modules/auth/entities/role.entity';
import { UserRole } from '../../../modules/auth/entities/user-role.entity';
import AppDataSource from '../../../config/ormconfig';

const router = Router();
const userService = new UserService();
const roleService = new RoleService(
  AppDataSource.getRepository(Role),
  AppDataSource.getRepository(UserRole)
);
const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
const authService = new AuthService(userService, jwtService, roleService);
const authController = new AuthController(authService);

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

// Protected routes
router.get('/me', jwtAuthMiddleware, (req, res) => authController.getMe(req, res));
router.post('/logout', jwtAuthMiddleware, (req, res) => authController.logout(req, res));

export default router;
